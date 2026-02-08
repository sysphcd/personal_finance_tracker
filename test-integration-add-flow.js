/**
 * 整合測試：完整的新增流程
 * 測試：輸入 → 新增 → 顯示 → 持久化
 * **Validates: Requirements 4.1, 5.1, 7.3**
 */

// 模擬 DOM 環境
const { JSDOM } = require('jsdom');

// 建立 DOM 環境
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

function createExpense(amount, category) {
    return {
        id: Date.now().toString(),
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
        return {
            valid: false,
            message: '請輸入金額'
        };
    }
    
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
        return {
            valid: false,
            message: '請輸入有效的數字'
        };
    }
    
    if (numAmount <= 0) {
        return {
            valid: false,
            message: '金額必須大於 0'
        };
    }
    
    return {
        valid: true,
        message: ''
    };
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

// 執行整合測試
console.log('開始整合測試：完整的新增流程');

// 初始化
localStorage.clear();
expenses = [];
updateTotalDisplay();

// 測試 1：輸入有效資料並新增
console.log('\n測試 1：新增第一筆支出');
const amountInput = document.getElementById('amountInput');
const categorySelect = document.getElementById('categorySelect');

amountInput.value = '100';
categorySelect.value = '飲食';

addExpense();

// 驗證：陣列中有一筆記錄
if (expenses.length !== 1) {
    console.error('✗ 失敗：陣列中應該有 1 筆記錄，實際有', expenses.length);
    process.exit(1);
}
console.log('✓ 通過：陣列中有 1 筆記錄');

// 驗證：記錄內容正確
if (expenses[0].amount !== 100 || expenses[0].category !== '飲食') {
    console.error('✗ 失敗：記錄內容不正確');
    process.exit(1);
}
console.log('✓ 通過：記錄內容正確');

// 驗證：顯示在 DOM 中
const expenseList = document.getElementById('expenseList');
const items = expenseList.querySelectorAll('.expense-item');
if (items.length !== 1) {
    console.error('✗ 失敗：DOM 中應該有 1 個項目，實際有', items.length);
    process.exit(1);
}
console.log('✓ 通過：記錄顯示在 DOM 中');

// 驗證：顯示格式正確
const displayText = items[0].querySelector('span').textContent;
if (displayText !== '飲食 - 100 元') {
    console.error('✗ 失敗：顯示格式不正確，實際為', displayText);
    process.exit(1);
}
console.log('✓ 通過：顯示格式正確');

// 驗證：儲存到 localStorage
const storedData = localStorage.getItem('expenses');
if (!storedData) {
    console.error('✗ 失敗：資料未儲存到 localStorage');
    process.exit(1);
}
const parsedData = JSON.parse(storedData);
if (parsedData.length !== 1) {
    console.error('✗ 失敗：localStorage 中應該有 1 筆記錄');
    process.exit(1);
}
console.log('✓ 通過：資料儲存到 localStorage');

// 驗證：總計更新
const totalElement = document.getElementById('totalAmount');
if (totalElement.textContent !== '今日總計：100 元') {
    console.error('✗ 失敗：總計顯示不正確，實際為', totalElement.textContent);
    process.exit(1);
}
console.log('✓ 通過：總計顯示正確');

// 驗證：輸入欄位已清空
if (amountInput.value !== '') {
    console.error('✗ 失敗：輸入欄位未清空');
    process.exit(1);
}
console.log('✓ 通過：輸入欄位已清空');

// 驗證：下拉選單重置
if (categorySelect.selectedIndex !== 0) {
    console.error('✗ 失敗：下拉選單未重置');
    process.exit(1);
}
console.log('✓ 通過：下拉選單已重置');

// 測試 2：新增第二筆支出
console.log('\n測試 2：新增第二筆支出');
amountInput.value = '50';
categorySelect.value = '交通';

addExpense();

// 驗證：陣列中有兩筆記錄
if (expenses.length !== 2) {
    console.error('✗ 失敗：陣列中應該有 2 筆記錄，實際有', expenses.length);
    process.exit(1);
}
console.log('✓ 通過：陣列中有 2 筆記錄');

// 驗證：DOM 中有兩個項目
const items2 = expenseList.querySelectorAll('.expense-item');
if (items2.length !== 2) {
    console.error('✗ 失敗：DOM 中應該有 2 個項目，實際有', items2.length);
    process.exit(1);
}
console.log('✓ 通過：DOM 中有 2 個項目');

// 驗證：總計更新為 150
if (totalElement.textContent !== '今日總計：150 元') {
    console.error('✗ 失敗：總計應該為 150，實際為', totalElement.textContent);
    process.exit(1);
}
console.log('✓ 通過：總計更新為 150 元');

// 測試 3：驗證持久化（模擬頁面重新載入）
console.log('\n測試 3：驗證持久化');
expenses = loadFromLocalStorage();
if (expenses.length !== 2) {
    console.error('✗ 失敗：從 localStorage 載入應該有 2 筆記錄');
    process.exit(1);
}
console.log('✓ 通過：從 localStorage 正確載入 2 筆記錄');

console.log('\n✓ 所有整合測試通過：完整的新增流程');
process.exit(0);
