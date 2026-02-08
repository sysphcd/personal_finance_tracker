// 個人記帳本 JavaScript

// 全域變數
// 支出記錄陣列，每個記錄包含：
// - id: string (唯一識別碼，使用 Date.now() 生成)
// - amount: number (金額，必須為正數)
// - category: string (類別：飲食、交通、娛樂)
let expenses = [];

/**
 * 建立支出記錄物件
 * @param {number} amount - 支出金額（正數）
 * @param {string} category - 支出類別（飲食/交通/娛樂）
 * @returns {Object} 支出記錄物件 { id, amount, category }
 */
function createExpense(amount, category) {
    return {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        category: category
    };
}

/**
 * 儲存支出記錄陣列到 localStorage
 * 將 expenses 陣列序列化為 JSON 並儲存到 localStorage
 * 處理儲存錯誤情況
 */
function saveToLocalStorage() {
    try {
        const jsonString = JSON.stringify(expenses);
        localStorage.setItem('expenses', jsonString);
    } catch (error) {
        // 處理儲存錯誤（例如：localStorage 已滿或不可用）
        console.error('儲存到 localStorage 失敗:', error);
        alert('無法儲存資料，請檢查瀏覽器儲存空間');
    }
}

/**
 * 從 localStorage 載入支出記錄陣列
 * 讀取並解析 JSON 資料，處理空值和解析錯誤
 * @returns {Array} 支出記錄陣列，如果沒有資料或發生錯誤則返回空陣列
 */
function loadFromLocalStorage() {
    try {
        // 從 localStorage 讀取資料
        const jsonString = localStorage.getItem('expenses');
        
        // 處理空值情況（第一次使用或資料被清除）
        if (jsonString === null || jsonString === '') {
            return [];
        }
        
        // 解析 JSON 字串
        const data = JSON.parse(jsonString);
        
        // 驗證解析結果是否為陣列
        if (!Array.isArray(data)) {
            console.warn('localStorage 中的資料格式不正確，已重置為空陣列');
            return [];
        }
        
        return data;
    } catch (error) {
        // 處理 JSON 解析錯誤或其他讀取錯誤
        console.error('從 localStorage 載入失敗:', error);
        // 清空損壞的資料
        localStorage.removeItem('expenses');
        return [];
    }
}

/**
 * 計算所有支出記錄的總金額
 * 遍歷 expenses 陣列並計算所有金額的總和
 * @returns {number} 總金額，如果沒有記錄則返回 0
 */
function calculateTotal() {
    // 使用 reduce 方法計算總和
    // 初始值為 0，累加每筆記錄的 amount
    return expenses.reduce((total, expense) => {
        return total + expense.amount;
    }, 0);
}

/**
 * 更新今日總計顯示
 * 呼叫 calculateTotal() 取得總額並更新 DOM 顯示「今日總計：XXX 元」
 */
function updateTotalDisplay() {
    // 取得總金額
    const total = calculateTotal();
    
    // 取得顯示元素
    const totalElement = document.getElementById('totalAmount');
    
    // 更新顯示文字
    if (totalElement) {
        totalElement.textContent = `今日總計：${total} 元`;
    }
}

/**
 * 驗證輸入的金額是否有效
 * 檢查金額是否為空或 <= 0
 * @param {string|number} amount - 要驗證的金額
 * @returns {Object} 驗證結果 { valid: boolean, message: string }
 */
function validateInput(amount) {
    // 檢查是否為空值
    if (amount === null || amount === undefined || amount === '') {
        return {
            valid: false,
            message: '請輸入金額'
        };
    }
    
    // 轉換為數字
    const numAmount = parseFloat(amount);
    
    // 檢查是否為有效數字
    if (isNaN(numAmount)) {
        return {
            valid: false,
            message: '請輸入有效的數字'
        };
    }
    
    // 檢查金額是否 <= 0
    if (numAmount <= 0) {
        return {
            valid: false,
            message: '金額必須大於 0'
        };
    }
    
    // 驗證通過
    return {
        valid: true,
        message: ''
    };
}

/**
 * 渲染單筆支出記錄到 DOM
 * 建立 DOM 元素顯示「分類 - 金額 元」，附加刪除按鈕
 * @param {Object} expense - 支出記錄物件 { id, amount, category }
 */
function renderExpense(expense) {
    // 取得清單容器
    const expenseList = document.getElementById('expenseList');
    if (!expenseList) {
        console.error('找不到支出清單容器');
        return;
    }
    
    // 建立支出項目容器
    const expenseItem = document.createElement('div');
    expenseItem.className = 'expense-item';
    expenseItem.dataset.id = expense.id; // 儲存 id 以便刪除時使用
    
    // 建立顯示文字元素（格式：分類 - 金額 元）
    const textSpan = document.createElement('span');
    textSpan.textContent = `${expense.category} - ${expense.amount} 元`;
    
    // 建立刪除按鈕
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '刪除';
    
    // 綁定刪除按鈕事件
    deleteBtn.addEventListener('click', function() {
        deleteExpense(expense.id);
    });
    
    // 組裝元素
    expenseItem.appendChild(textSpan);
    expenseItem.appendChild(deleteBtn);
    
    // 插入到清單容器
    expenseList.appendChild(expenseItem);
}

/**
 * 渲染所有支出記錄到 DOM
 * 清空清單容器並遍歷 expenses 陣列，呼叫 renderExpense() 顯示每筆記錄
 */
function renderAllExpenses() {
    // 取得清單容器
    const expenseList = document.getElementById('expenseList');
    if (!expenseList) {
        console.error('找不到支出清單容器');
        return;
    }
    
    // 清空清單容器
    expenseList.innerHTML = '';
    
    // 遍歷所有支出記錄並渲染
    expenses.forEach(expense => {
        renderExpense(expense);
    });
}

/**
 * 刪除支出記錄
 * 根據 id 從資料陣列中移除記錄，更新 localStorage，從 DOM 中移除元素，更新總計
 * @param {string} id - 要刪除的支出記錄 id
 */
function deleteExpense(id) {
    // 從資料陣列中移除記錄
    const index = expenses.findIndex(expense => expense.id === id);
    
    if (index === -1) {
        console.error('找不到要刪除的記錄:', id);
        return;
    }
    
    // 移除記錄
    expenses.splice(index, 1);
    
    // 更新 localStorage
    saveToLocalStorage();
    
    // 從 DOM 中移除對應元素
    const expenseList = document.getElementById('expenseList');
    if (expenseList) {
        // 使用更安全的方式查找元素，避免 CSS 選擇器特殊字符問題
        const items = expenseList.querySelectorAll('.expense-item');
        for (let item of items) {
            if (item.dataset.id === id) {
                item.remove();
                break;
            }
        }
    }
    
    // 更新今日總計
    updateTotalDisplay();
}

/**
 * 新增支出記錄
 * 取得輸入值並驗證，建立新記錄，儲存到 localStorage，顯示記錄，更新總計
 */
function addExpense() {
    // 取得輸入元素
    const amountInput = document.getElementById('amountInput');
    const categorySelect = document.getElementById('categorySelect');
    
    if (!amountInput || !categorySelect) {
        console.error('找不到輸入元素');
        return;
    }
    
    // 取得輸入值
    const amount = amountInput.value;
    const category = categorySelect.value;
    
    // 驗證輸入
    const validation = validateInput(amount);
    if (!validation.valid) {
        alert(validation.message);
        return;
    }
    
    // 建立新的支出記錄物件
    const newExpense = createExpense(amount, category);
    
    // 將記錄加入資料陣列
    expenses.push(newExpense);
    
    // 儲存到 localStorage
    saveToLocalStorage();
    
    // 顯示新記錄
    renderExpense(newExpense);
    
    // 清空輸入欄位
    amountInput.value = '';
    
    // 重置下拉選單到第一個選項
    categorySelect.selectedIndex = 0;
    
    // 更新今日總計
    updateTotalDisplay();
}

// 初始化函式
function init() {
    // 從 localStorage 載入資料
    expenses = loadFromLocalStorage();
    console.log('個人記帳本已載入，載入了', expenses.length, '筆記錄');
    
    // 渲染所有支出記錄
    renderAllExpenses();
    
    // 更新今日總計顯示
    updateTotalDisplay();
    
    // 綁定新增按鈕事件監聽器
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addExpense);
        console.log('新增按鈕事件監聽器已綁定');
    } else {
        console.error('找不到新增按鈕元素');
    }
}

// 當 DOM 完全載入後執行初始化
document.addEventListener('DOMContentLoaded', init);
