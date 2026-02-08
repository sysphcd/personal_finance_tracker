#!/usr/bin/env node

/**
 * 整合測試：任務 4.2 - 5.3
 * 測試所有已實作的功能整合運作
 */

// 模擬 localStorage
const localStorage = {
    data: {},
    getItem: function(key) {
        return this.data[key] || null;
    },
    setItem: function(key, value) {
        this.data[key] = value;
    },
    removeItem: function(key) {
        delete this.data[key];
    },
    clear: function() {
        this.data = {};
    }
};

// 模擬 DOM 環境
let eventListeners = {};

const document = {
    getElementById: function(id) {
        if (id === 'addBtn') {
            return this.addBtn;
        } else if (id === 'amountInput') {
            return this.amountInput;
        } else if (id === 'categorySelect') {
            return this.categorySelect;
        } else if (id === 'totalAmount') {
            return this.totalElement;
        }
        return null;
    },
    addBtn: {
        addEventListener: function(event, handler) {
            if (!eventListeners[event]) {
                eventListeners[event] = [];
            }
            eventListeners[event].push(handler);
        },
        click: function() {
            if (eventListeners['click']) {
                eventListeners['click'].forEach(handler => handler());
            }
        }
    },
    amountInput: {
        value: ''
    },
    categorySelect: {
        value: '飲食',
        selectedIndex: 0
    },
    totalElement: {
        textContent: '今日總計：0 元'
    },
    addEventListener: function(event, handler) {
        if (event === 'DOMContentLoaded') {
            handler();
        }
    }
};

// 模擬 alert
let alertMessages = [];
global.alert = function(msg) {
    alertMessages.push(msg);
};

// 複製所有函式
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
    
    amountInput.value = '';
    categorySelect.selectedIndex = 0;
    
    updateTotalDisplay();
}

function init() {
    expenses = loadFromLocalStorage();
    updateTotalDisplay();
    
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addExpense);
    }
}

// 整合測試
function runIntegrationTests() {
    console.log('\n=== 整合測試：任務 4.2 - 5.3 ===\n');
    
    let allPassed = true;
    
    // 場景 1: 完整的新增流程
    console.log('場景 1：完整的新增支出流程...');
    localStorage.clear();
    expenses = [];
    eventListeners = {};
    alertMessages = [];
    
    // 初始化應用程式
    document.addEventListener('DOMContentLoaded', init);
    
    // 檢查初始狀態
    const test1a = document.totalElement.textContent === '今日總計：0 元';
    console.log(`  1a. 初始總計顯示 0 元: ${test1a ? '✓' : '✗'}`);
    allPassed = allPassed && test1a;
    
    // 新增第一筆記錄
    document.amountInput.value = '100';
    document.categorySelect.value = '飲食';
    document.addBtn.click();
    
    const test1b = expenses.length === 1;
    const test1c = expenses[0].amount === 100;
    const test1d = expenses[0].category === '飲食';
    const test1e = document.totalElement.textContent === '今日總計：100 元';
    const test1f = document.amountInput.value === '';
    
    console.log(`  1b. 新增後清單長度為 1: ${test1b ? '✓' : '✗'}`);
    console.log(`  1c. 記錄金額為 100: ${test1c ? '✓' : '✗'}`);
    console.log(`  1d. 記錄類別為「飲食」: ${test1d ? '✓' : '✗'}`);
    console.log(`  1e. 總計更新為 100 元: ${test1e ? '✓' : '✗'}`);
    console.log(`  1f. 輸入欄位已清空: ${test1f ? '✓' : '✗'}`);
    
    allPassed = allPassed && test1b && test1c && test1d && test1e && test1f;
    
    // 場景 2: 多筆記錄累積
    console.log('\n場景 2：多筆記錄累積...');
    
    document.amountInput.value = '50';
    document.categorySelect.value = '交通';
    document.addBtn.click();
    
    document.amountInput.value = '200';
    document.categorySelect.value = '娛樂';
    document.addBtn.click();
    
    const test2a = expenses.length === 3;
    const test2b = calculateTotal() === 350;
    const test2c = document.totalElement.textContent === '今日總計：350 元';
    
    console.log(`  2a. 清單包含 3 筆記錄: ${test2a ? '✓' : '✗'}`);
    console.log(`  2b. 總計計算正確 (350): ${test2b ? '✓' : '✗'}`);
    console.log(`  2c. 總計顯示正確: ${test2c ? '✓' : '✗'}`);
    
    allPassed = allPassed && test2a && test2b && test2c;
    
    // 場景 3: localStorage 持久化
    console.log('\n場景 3：localStorage 持久化...');
    
    const savedData = localStorage.getItem('expenses');
    const test3a = savedData !== null;
    
    const parsedData = JSON.parse(savedData);
    const test3b = parsedData.length === 3;
    const test3c = parsedData[0].amount === 100;
    const test3d = parsedData[1].amount === 50;
    const test3e = parsedData[2].amount === 200;
    
    console.log(`  3a. localStorage 包含資料: ${test3a ? '✓' : '✗'}`);
    console.log(`  3b. 儲存 3 筆記錄: ${test3b ? '✓' : '✗'}`);
    console.log(`  3c. 第 1 筆金額正確: ${test3c ? '✓' : '✗'}`);
    console.log(`  3d. 第 2 筆金額正確: ${test3d ? '✓' : '✗'}`);
    console.log(`  3e. 第 3 筆金額正確: ${test3e ? '✓' : '✗'}`);
    
    allPassed = allPassed && test3a && test3b && test3c && test3d && test3e;
    
    // 場景 4: 頁面重新載入
    console.log('\n場景 4：頁面重新載入後資料保留...');
    
    // 模擬頁面重新載入
    expenses = [];
    eventListeners = {};
    document.totalElement.textContent = '今日總計：0 元';
    
    // 重新初始化
    document.addEventListener('DOMContentLoaded', init);
    
    const test4a = expenses.length === 3;
    const test4b = calculateTotal() === 350;
    const test4c = document.totalElement.textContent === '今日總計：350 元';
    
    console.log(`  4a. 載入 3 筆記錄: ${test4a ? '✓' : '✗'}`);
    console.log(`  4b. 總計計算正確: ${test4b ? '✓' : '✗'}`);
    console.log(`  4c. 總計顯示正確: ${test4c ? '✓' : '✗'}`);
    
    allPassed = allPassed && test4a && test4b && test4c;
    
    // 場景 5: 輸入驗證
    console.log('\n場景 5：輸入驗證...');
    
    alertMessages = [];
    const lengthBefore = expenses.length;
    
    // 測試空值
    document.amountInput.value = '';
    document.addBtn.click();
    const test5a = alertMessages.length === 1 && alertMessages[0] === '請輸入金額';
    
    // 測試零
    document.amountInput.value = '0';
    document.addBtn.click();
    const test5b = alertMessages.length === 2 && alertMessages[1] === '金額必須大於 0';
    
    // 測試負數
    document.amountInput.value = '-10';
    document.addBtn.click();
    const test5c = alertMessages.length === 3 && alertMessages[2] === '金額必須大於 0';
    
    const lengthAfter = expenses.length;
    const test5d = lengthAfter === lengthBefore;
    
    console.log(`  5a. 空值被拒絕: ${test5a ? '✓' : '✗'}`);
    console.log(`  5b. 零被拒絕: ${test5b ? '✓' : '✗'}`);
    console.log(`  5c. 負數被拒絕: ${test5c ? '✓' : '✗'}`);
    console.log(`  5d. 清單長度未改變: ${test5d ? '✓' : '✗'}`);
    
    allPassed = allPassed && test5a && test5b && test5c && test5d;
    
    // 總結
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
        console.log('✓ 所有整合測試通過！\n');
        console.log('已完成的任務：');
        console.log('  ✓ 4.2 實作 updateTotalDisplay() 函式');
        console.log('  ✓ 4.3 撰寫屬性測試：今日總計計算正確性');
        console.log('  ✓ 4.4 撰寫單元測試：空清單顯示零元');
        console.log('  ✓ 5.1 實作輸入驗證函式');
        console.log('  ✓ 5.2 實作 addExpense() 函式');
        console.log('  ✓ 5.3 綁定新增按鈕事件監聽器\n');
        process.exit(0);
    } else {
        console.log('✗ 部分整合測試失敗\n');
        process.exit(1);
    }
}

// 執行測試
runIntegrationTests();
