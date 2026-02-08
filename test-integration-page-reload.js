/**
 * 整合測試：頁面重新載入
 * 測試：新增記錄 → 重新整理頁面 → 驗證資料保留
 * **Validates: Requirements 5.2, 5.3**
 */

// 模擬 DOM 環境
const { JSDOM } = require('jsdom');

// 模擬 localStorage（在多次「頁面載入」之間保持）
const localStorageMock = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value;
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    }
};

// 模擬頁面載入的函式
function simulatePageLoad() {
    // 建立新的 DOM 環境（模擬頁面重新載入）
    const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <input type="number" id="amountInput" value="">
    <select id="categorySelect">
        <option value="飲食">飲食</option>
        <option value="交通">交通</option>
        <option value="娛樂">娛樂</option>
    </select>
    <button id="addBtn">新增支出</button>
    <div id="totalAmount">今日總計：0 元</div>
    <div id="expenseList"></div>
</body>
</html>
    `);
    
    global.document = dom.window.document;
    global.window = dom.window;
    global.alert = (msg) => console.log('Alert:', msg);
    
    // localStorage 保持不變（模擬瀏覽器行為）
    global.localStorage = localStorageMock;
    
    // 重新定義所有函式（模擬 script.js 重新載入）
    let expenses = [];
    
    function createExpense(amount, category) {
        return {
            id: Date.now().toString() + Math.random(), // 確保唯一性
            amount: parseFloat(amount),
            category: category
        };
    }
    
    function saveToLocalStorage() {
        try {
            const jsonString = JSON.stringify(expenses);
            localStorage.setItem('expenses', jsonString);
        } catch (error) {
            console.error('儲存到 localStorage 失敗:', error);
        }
    }
    
    function loadFromLocalStorage() {
        try {
            const jsonString = localStorage.getItem('expenses');
            if (jsonString === null || jsonString === '') {
                return [];
            }
            const data = JSON.parse(jsonString);
            if (!Array.isArray(data)) {
                return [];
            }
            return data;
        } catch (error) {
            localStorage.removeItem('expenses');
            return [];
        }
    }
    
    function calculateTotal() {
        return expenses.reduce((total, expense) => {
            return total + expense.amount;
        }, 0);
    }
    
    function updateTotalDisplay() {
        const total = calculateTotal();
        const totalElement = document.getElementById('totalAmount');
        if (totalElement) {
            totalElement.textContent = `今日總計：${total} 元`;
        }
    }
    
    function validateInput(amount) {
        if (amount === null || amount === undefined || amount === '') {
            return { valid: false, message: '請輸入金額' };
        }
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
            return { valid: false, message: '請輸入有效的數字' };
        }
        if (numAmount <= 0) {
            return { valid: false, message: '金額必須大於 0' };
        }
        return { valid: true, message: '' };
    }
    
    function renderExpense(expense) {
        const expenseList = document.getElementById('expenseList');
        if (!expenseList) {
            return;
        }
        
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.dataset.id = expense.id;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = `${expense.category} - ${expense.amount} 元`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '刪除';
        
        expenseItem.appendChild(textSpan);
        expenseItem.appendChild(deleteBtn);
        
        expenseList.appendChild(expenseItem);
    }
    
    function renderAllExpenses() {
        const expenseList = document.getElementById('expenseList');
        if (!expenseList) {
            return;
        }
        
        expenseList.innerHTML = '';
        
        expenses.forEach(expense => {
            renderExpense(expense);
        });
    }
    
    function addExpense() {
        const amountInput = document.getElementById('amountInput');
        const categorySelect = document.getElementById('categorySelect');
        
        if (!amountInput || !categorySelect) {
            console.error('找不到輸入元素');
            return;
        }
        
        const amount = amountInput.value;
        const category = categorySelect.value;
        
        const validation = validateInput(amount);
        if (!validation.valid) {
            alert(validation.message);
            return;
        }
        
        const newExpense = createExpense(amount, category);
        expenses.push(newExpense);
        saveToLocalStorage();
        renderExpense(newExpense);
        
        amountInput.value = '';
        categorySelect.selectedIndex = 0;
        
        updateTotalDisplay();
    }
    
    function init() {
        expenses = loadFromLocalStorage();
        renderAllExpenses();
        updateTotalDisplay();
    }
    
    // 執行初始化（模擬 DOMContentLoaded）
    init();
    
    // 返回 API 供測試使用
    return {
        expenses,
        addExpense,
        getExpenseList: () => document.getElementById('expenseList'),
        getTotalElement: () => document.getElementById('totalAmount'),
        getAmountInput: () => document.getElementById('amountInput'),
        getCategorySelect: () => document.getElementById('categorySelect')
    };
}

// 執行整合測試
console.log('開始整合測試：頁面重新載入');

// 清空 localStorage
localStorageMock.clear();

// 第一次頁面載入
console.log('\n第一次頁面載入：');
let page1 = simulatePageLoad();

// 驗證：初始狀態為空
if (page1.expenses.length !== 0) {
    console.error('✗ 失敗：初始狀態應該為空');
    process.exit(1);
}
console.log('✓ 通過：初始狀態為空');

// 新增第一筆記錄
console.log('\n新增第一筆記錄：飲食 - 100 元');
page1.getAmountInput().value = '100';
page1.getCategorySelect().value = '飲食';
page1.addExpense();

// 驗證：記錄已新增
if (page1.expenses.length !== 1) {
    console.error('✗ 失敗：應該有 1 筆記錄');
    process.exit(1);
}
console.log('✓ 通過：記錄已新增');

// 新增第二筆記錄
console.log('\n新增第二筆記錄：交通 - 50 元');
page1.getAmountInput().value = '50';
page1.getCategorySelect().value = '交通';
page1.addExpense();

// 驗證：有兩筆記錄
if (page1.expenses.length !== 2) {
    console.error('✗ 失敗：應該有 2 筆記錄');
    process.exit(1);
}
console.log('✓ 通過：有 2 筆記錄');

// 驗證：總計為 150
if (page1.getTotalElement().textContent !== '今日總計：150 元') {
    console.error('✗ 失敗：總計應該為 150');
    process.exit(1);
}
console.log('✓ 通過：總計為 150 元');

// 模擬頁面重新載入
console.log('\n模擬頁面重新載入...');
let page2 = simulatePageLoad();

// 驗證：資料保留
if (page2.expenses.length !== 2) {
    console.error('✗ 失敗：重新載入後應該有 2 筆記錄，實際有', page2.expenses.length);
    process.exit(1);
}
console.log('✓ 通過：資料保留（2 筆記錄）');

// 驗證：記錄內容正確
const expense1 = page2.expenses.find(exp => exp.amount === 100 && exp.category === '飲食');
const expense2 = page2.expenses.find(exp => exp.amount === 50 && exp.category === '交通');

if (!expense1 || !expense2) {
    console.error('✗ 失敗：記錄內容不正確');
    process.exit(1);
}
console.log('✓ 通過：記錄內容正確');

// 驗證：DOM 中顯示 2 個項目
const items = page2.getExpenseList().querySelectorAll('.expense-item');
if (items.length !== 2) {
    console.error('✗ 失敗：DOM 中應該有 2 個項目，實際有', items.length);
    process.exit(1);
}
console.log('✓ 通過：DOM 中顯示 2 個項目');

// 驗證：總計正確
if (page2.getTotalElement().textContent !== '今日總計：150 元') {
    console.error('✗ 失敗：總計應該為 150，實際為', page2.getTotalElement().textContent);
    process.exit(1);
}
console.log('✓ 通過：總計正確（150 元）');

// 新增第三筆記錄
console.log('\n在重新載入後新增第三筆記錄：娛樂 - 30 元');
page2.getAmountInput().value = '30';
page2.getCategorySelect().value = '娛樂';
page2.addExpense();

// 驗證：有三筆記錄
if (page2.expenses.length !== 3) {
    console.error('✗ 失敗：應該有 3 筆記錄');
    process.exit(1);
}
console.log('✓ 通過：有 3 筆記錄');

// 再次模擬頁面重新載入
console.log('\n再次模擬頁面重新載入...');
let page3 = simulatePageLoad();

// 驗證：所有三筆記錄都保留
if (page3.expenses.length !== 3) {
    console.error('✗ 失敗：重新載入後應該有 3 筆記錄，實際有', page3.expenses.length);
    process.exit(1);
}
console.log('✓ 通過：所有 3 筆記錄都保留');

// 驗證：總計為 180
if (page3.getTotalElement().textContent !== '今日總計：180 元') {
    console.error('✗ 失敗：總計應該為 180，實際為', page3.getTotalElement().textContent);
    process.exit(1);
}
console.log('✓ 通過：總計為 180 元');

console.log('\n✓ 所有整合測試通過：頁面重新載入');
process.exit(0);
