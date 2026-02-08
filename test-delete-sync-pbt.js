/**
 * 屬性測試：刪除操作同步更新
 * **Validates: Requirements 6.2, 6.3, 5.4**
 * 
 * 對於任何被刪除的支出記錄，該記錄應該從顯示清單、資料陣列和 localStorage 中同時移除
 */

// 模擬 DOM 環境
const { JSDOM } = require('jsdom');
const fc = require('fast-check');

// 建立 DOM 環境
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <div id="expenseList"></div>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

// 模擬 localStorage
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

global.localStorage = localStorageMock;

// 載入 script.js 的函式（手動複製需要的函式）
let expenses = [];

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
        console.error('從 localStorage 載入失敗:', error);
        localStorage.removeItem('expenses');
        return [];
    }
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

function deleteExpense(id) {
    const index = expenses.findIndex(expense => expense.id === id);
    
    if (index === -1) {
        return;
    }
    
    expenses.splice(index, 1);
    saveToLocalStorage();
    
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
}

// 定義類別選項
const categories = ['飲食', '交通', '娛樂'];

// 生成隨機支出記錄陣列
const expensesArrayArbitrary = fc.array(
    fc.record({
        id: fc.string({ minLength: 1 }),
        amount: fc.double({ min: 0.01, max: 100000, noNaN: true }),
        category: fc.constantFrom(...categories)
    }),
    { minLength: 1, maxLength: 20 }
);

// 屬性：刪除操作同步更新
const deleteSyncProperty = fc.property(
    expensesArrayArbitrary,
    fc.integer({ min: 0 }),
    (initialExpenses, indexSeed) => {
        // 清空環境
        expenses = [...initialExpenses];
        localStorage.clear();
        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = '';
        
        // 儲存初始資料到 localStorage
        saveToLocalStorage();
        
        // 渲染所有記錄
        expenses.forEach(expense => {
            renderExpense(expense);
        });
        
        // 選擇要刪除的記錄（使用模運算確保索引有效）
        const deleteIndex = indexSeed % expenses.length;
        const expenseToDelete = expenses[deleteIndex];
        const idToDelete = expenseToDelete.id;
        
        // 記錄刪除前的狀態
        const lengthBefore = expenses.length;
        const itemsBefore = expenseList.querySelectorAll('.expense-item').length;
        
        // 執行刪除
        deleteExpense(idToDelete);
        
        // 驗證 1：從資料陣列中移除
        const stillInArray = expenses.some(expense => expense.id === idToDelete);
        if (stillInArray) {
            return false;
        }
        
        // 驗證 2：陣列長度減少 1
        if (expenses.length !== lengthBefore - 1) {
            return false;
        }
        
        // 驗證 3：從 DOM 中移除
        const itemsAfter = expenseList.querySelectorAll('.expense-item').length;
        if (itemsAfter !== itemsBefore - 1) {
            return false;
        }
        
        // 檢查 DOM 中是否還有該 id 的元素
        const items = expenseList.querySelectorAll('.expense-item');
        for (let item of items) {
            if (item.dataset.id === idToDelete) {
                return false;
            }
        }
        
        // 驗證 4：從 localStorage 中移除
        const loadedExpenses = loadFromLocalStorage();
        const stillInStorage = loadedExpenses.some(expense => expense.id === idToDelete);
        if (stillInStorage) {
            return false;
        }
        
        // 驗證 5：localStorage 中的數量正確
        if (loadedExpenses.length !== lengthBefore - 1) {
            return false;
        }
        
        return true;
    }
);

// 執行測試
try {
    fc.assert(deleteSyncProperty, { numRuns: 100 });
    console.log('✓ 屬性測試通過：刪除操作同步更新（100 次迭代）');
    process.exit(0);
} catch (error) {
    console.error('✗ 屬性測試失敗：', error.message);
    process.exit(1);
}
