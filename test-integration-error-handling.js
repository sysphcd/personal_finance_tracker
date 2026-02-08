/**
 * 整合測試：錯誤處理
 * 測試：無效輸入的警告訊息、localStorage 錯誤處理
 * **Validates: Requirements 4.3, 4.4**
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

// 收集 alert 訊息
const alertMessages = [];
global.alert = (msg) => {
    alertMessages.push(msg);
    console.log('Alert:', msg);
};

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
        alert('無法儲存資料，請檢查瀏覽器儲存空間');
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
            console.warn('localStorage 中的資料格式不正確，已重置為空陣列');
            return [];
        }
        return data;
    } catch (error) {
        console.error('從 localStorage 載入失敗:', error);
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
console.log('開始整合測試：錯誤處理');

// 初始化
localStorage.clear();
expenses = [];
updateTotalDisplay();

const amountInput = document.getElementById('amountInput');
const categorySelect = document.getElementById('categorySelect');

// 測試 1：空值輸入
console.log('\n測試 1：空值輸入');
alertMessages.length = 0;
amountInput.value = '';
categorySelect.value = '飲食';

addExpense();

// 驗證：顯示警告訊息
if (alertMessages.length !== 1) {
    console.error('✗ 失敗：應該顯示 1 個警告訊息，實際顯示', alertMessages.length);
    process.exit(1);
}
console.log('✓ 通過：顯示警告訊息');

// 驗證：警告訊息內容正確
if (alertMessages[0] !== '請輸入金額') {
    console.error('✗ 失敗：警告訊息不正確，實際為', alertMessages[0]);
    process.exit(1);
}
console.log('✓ 通過：警告訊息為「請輸入金額」');

// 驗證：記錄未被新增
if (expenses.length !== 0) {
    console.error('✗ 失敗：空值輸入不應新增記錄');
    process.exit(1);
}
console.log('✓ 通過：記錄未被新增');

// 測試 2：零值輸入
console.log('\n測試 2：零值輸入');
alertMessages.length = 0;
amountInput.value = '0';

addExpense();

// 驗證：顯示警告訊息
if (alertMessages.length !== 1) {
    console.error('✗ 失敗：應該顯示 1 個警告訊息');
    process.exit(1);
}
console.log('✓ 通過：顯示警告訊息');

// 驗證：警告訊息內容正確
if (alertMessages[0] !== '金額必須大於 0') {
    console.error('✗ 失敗：警告訊息不正確，實際為', alertMessages[0]);
    process.exit(1);
}
console.log('✓ 通過：警告訊息為「金額必須大於 0」');

// 驗證：記錄未被新增
if (expenses.length !== 0) {
    console.error('✗ 失敗：零值輸入不應新增記錄');
    process.exit(1);
}
console.log('✓ 通過：記錄未被新增');

// 測試 3：負值輸入
console.log('\n測試 3：負值輸入');
alertMessages.length = 0;
amountInput.value = '-50';

addExpense();

// 驗證：顯示警告訊息
if (alertMessages.length !== 1) {
    console.error('✗ 失敗：應該顯示 1 個警告訊息');
    process.exit(1);
}
console.log('✓ 通過：顯示警告訊息');

// 驗證：警告訊息內容正確
if (alertMessages[0] !== '金額必須大於 0') {
    console.error('✗ 失敗：警告訊息不正確，實際為', alertMessages[0]);
    process.exit(1);
}
console.log('✓ 通過：警告訊息為「金額必須大於 0」');

// 驗證：記錄未被新增
if (expenses.length !== 0) {
    console.error('✗ 失敗：負值輸入不應新增記錄');
    process.exit(1);
}
console.log('✓ 通過：記錄未被新增');

// 測試 4：非數字輸入（validateInput 函式測試）
console.log('\n測試 4：非數字輸入驗證');
const validation1 = validateInput('abc');

if (validation1.valid) {
    console.error('✗ 失敗：非數字輸入應該驗證失敗');
    process.exit(1);
}
console.log('✓ 通過：非數字輸入驗證失敗');

if (validation1.message !== '請輸入有效的數字') {
    console.error('✗ 失敗：錯誤訊息不正確，實際為', validation1.message);
    process.exit(1);
}
console.log('✓ 通過：錯誤訊息為「請輸入有效的數字」');

// 測試 5：localStorage 解析錯誤處理
console.log('\n測試 5：localStorage 解析錯誤處理');
localStorage.clear();
localStorage.setItem('expenses', 'invalid json');

const loadedData = loadFromLocalStorage();

// 驗證：返回空陣列
if (!Array.isArray(loadedData) || loadedData.length !== 0) {
    console.error('✗ 失敗：解析錯誤時應返回空陣列');
    process.exit(1);
}
console.log('✓ 通過：解析錯誤時返回空陣列');

// 驗證：損壞的資料已被清除
const clearedData = localStorage.getItem('expenses');
if (clearedData !== null) {
    console.error('✗ 失敗：損壞的資料應該被清除');
    process.exit(1);
}
console.log('✓ 通過：損壞的資料已被清除');

// 測試 6：localStorage 非陣列資料處理
console.log('\n測試 6：localStorage 非陣列資料處理');
localStorage.clear();
localStorage.setItem('expenses', '{"not": "an array"}');

const loadedData2 = loadFromLocalStorage();

// 驗證：返回空陣列
if (!Array.isArray(loadedData2) || loadedData2.length !== 0) {
    console.error('✗ 失敗：非陣列資料時應返回空陣列');
    process.exit(1);
}
console.log('✓ 通過：非陣列資料時返回空陣列');

// 測試 7：有效輸入後的正常行為
console.log('\n測試 7：有效輸入後的正常行為');
localStorage.clear();
expenses = [];
alertMessages.length = 0;

amountInput.value = '100';
categorySelect.value = '飲食';

addExpense();

// 驗證：沒有警告訊息
if (alertMessages.length !== 0) {
    console.error('✗ 失敗：有效輸入不應顯示警告訊息');
    process.exit(1);
}
console.log('✓ 通過：沒有警告訊息');

// 驗證：記錄已新增
if (expenses.length !== 1) {
    console.error('✗ 失敗：有效輸入應新增記錄');
    process.exit(1);
}
console.log('✓ 通過：記錄已新增');

// 測試 8：邊界值測試（0.01）
console.log('\n測試 8：邊界值測試（0.01）');
alertMessages.length = 0;
amountInput.value = '0.01';

addExpense();

// 驗證：沒有警告訊息
if (alertMessages.length !== 0) {
    console.error('✗ 失敗：0.01 是有效輸入，不應顯示警告');
    process.exit(1);
}
console.log('✓ 通過：0.01 被接受為有效輸入');

// 驗證：記錄已新增
if (expenses.length !== 2) {
    console.error('✗ 失敗：應該有 2 筆記錄');
    process.exit(1);
}
console.log('✓ 通過：記錄已新增');

console.log('\n✓ 所有整合測試通過：錯誤處理');
process.exit(0);
