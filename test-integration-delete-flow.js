/**
 * 整合測試：完整的刪除流程
 * 測試：刪除 → 更新顯示 → 更新 localStorage → 更新總計
 * **Validates: Requirements 6.2, 6.3, 6.4**
 */

// 模擬 DOM 環境
const { JSDOM } = require('jsdom');

// 建立 DOM 環境
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <div id="totalAmount">今日總計：0 元</div>
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

// 載入 script.js（手動複製所有函式）
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

function deleteExpense(id) {
    const index = expenses.findIndex(expense => expense.id === id);
    
    if (index === -1) {
        return;
    }
    
    expenses.splice(index, 1);
    saveToLocalStorage();
    
    const expenseList = document.getElementById('expenseList');
    if (expenseList) {
        const items = expenseList.querySelectorAll('.expense-item');
        for (let item of items) {
            if (item.dataset.id === id) {
                item.remove();
                break;
            }
        }
    }
    
    updateTotalDisplay();
}

// 執行整合測試
console.log('開始整合測試：完整的刪除流程');

// 初始化：建立測試資料
localStorage.clear();
expenses = [
    { id: '1', amount: 100, category: '飲食' },
    { id: '2', amount: 50, category: '交通' },
    { id: '3', amount: 30, category: '娛樂' }
];

saveToLocalStorage();
renderAllExpenses();
updateTotalDisplay();

console.log('\n初始狀態：');
console.log('- 陣列中有', expenses.length, '筆記錄');
console.log('- 總計：', document.getElementById('totalAmount').textContent);

// 測試 1：刪除第二筆記錄
console.log('\n測試 1：刪除第二筆記錄（交通 - 50 元）');
const idToDelete = '2';

deleteExpense(idToDelete);

// 驗證：陣列中剩餘 2 筆記錄
if (expenses.length !== 2) {
    console.error('✗ 失敗：陣列中應該有 2 筆記錄，實際有', expenses.length);
    process.exit(1);
}
console.log('✓ 通過：陣列中剩餘 2 筆記錄');

// 驗證：被刪除的記錄不在陣列中
const stillInArray = expenses.some(exp => exp.id === idToDelete);
if (stillInArray) {
    console.error('✗ 失敗：被刪除的記錄仍在陣列中');
    process.exit(1);
}
console.log('✓ 通過：被刪除的記錄不在陣列中');

// 驗證：DOM 中剩餘 2 個項目
const expenseList = document.getElementById('expenseList');
const items = expenseList.querySelectorAll('.expense-item');
if (items.length !== 2) {
    console.error('✗ 失敗：DOM 中應該有 2 個項目，實際有', items.length);
    process.exit(1);
}
console.log('✓ 通過：DOM 中剩餘 2 個項目');

// 驗證：被刪除的記錄不在 DOM 中
let stillInDOM = false;
for (let item of items) {
    if (item.dataset.id === idToDelete) {
        stillInDOM = true;
        break;
    }
}
if (stillInDOM) {
    console.error('✗ 失敗：被刪除的記錄仍在 DOM 中');
    process.exit(1);
}
console.log('✓ 通過：被刪除的記錄不在 DOM 中');

// 驗證：localStorage 已更新
const storedData = loadFromLocalStorage();
if (storedData.length !== 2) {
    console.error('✗ 失敗：localStorage 中應該有 2 筆記錄');
    process.exit(1);
}
const stillInStorage = storedData.some(exp => exp.id === idToDelete);
if (stillInStorage) {
    console.error('✗ 失敗：被刪除的記錄仍在 localStorage 中');
    process.exit(1);
}
console.log('✓ 通過：localStorage 已更新');

// 驗證：總計已更新（100 + 30 = 130）
const totalElement = document.getElementById('totalAmount');
if (totalElement.textContent !== '今日總計：130 元') {
    console.error('✗ 失敗：總計應該為 130，實際為', totalElement.textContent);
    process.exit(1);
}
console.log('✓ 通過：總計已更新為 130 元');

// 測試 2：刪除第一筆記錄
console.log('\n測試 2：刪除第一筆記錄（飲食 - 100 元）');
deleteExpense('1');

// 驗證：陣列中剩餘 1 筆記錄
if (expenses.length !== 1) {
    console.error('✗ 失敗：陣列中應該有 1 筆記錄，實際有', expenses.length);
    process.exit(1);
}
console.log('✓ 通過：陣列中剩餘 1 筆記錄');

// 驗證：總計已更新（30）
if (totalElement.textContent !== '今日總計：30 元') {
    console.error('✗ 失敗：總計應該為 30，實際為', totalElement.textContent);
    process.exit(1);
}
console.log('✓ 通過：總計已更新為 30 元');

// 測試 3：刪除最後一筆記錄
console.log('\n測試 3：刪除最後一筆記錄（娛樂 - 30 元）');
deleteExpense('3');

// 驗證：陣列為空
if (expenses.length !== 0) {
    console.error('✗ 失敗：陣列應該為空，實際有', expenses.length, '筆記錄');
    process.exit(1);
}
console.log('✓ 通過：陣列為空');

// 驗證：DOM 為空
const items3 = expenseList.querySelectorAll('.expense-item');
if (items3.length !== 0) {
    console.error('✗ 失敗：DOM 應該為空，實際有', items3.length, '個項目');
    process.exit(1);
}
console.log('✓ 通過：DOM 為空');

// 驗證：總計為 0
if (totalElement.textContent !== '今日總計：0 元') {
    console.error('✗ 失敗：總計應該為 0，實際為', totalElement.textContent);
    process.exit(1);
}
console.log('✓ 通過：總計為 0 元');

// 驗證：localStorage 為空
const storedData3 = loadFromLocalStorage();
if (storedData3.length !== 0) {
    console.error('✗ 失敗：localStorage 應該為空');
    process.exit(1);
}
console.log('✓ 通過：localStorage 為空');

console.log('\n✓ 所有整合測試通過：完整的刪除流程');
process.exit(0);
