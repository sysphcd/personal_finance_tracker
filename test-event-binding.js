#!/usr/bin/env node

/**
 * 單元測試：事件監聽器綁定
 * **Validates: Requirements 4.1**
 * 
 * 測試新增按鈕事件監聽器正確綁定
 */

// 模擬 localStorage
const localStorage = {
    data: {},
    getItem: function(key) {
        return this.data[key] || null;
    },
    setItem: function(key, value) {
        this.data[key] = value;
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
        // 模擬 DOMContentLoaded
        if (event === 'DOMContentLoaded') {
            // 立即執行
            handler();
        }
    }
};

// 模擬 alert
let alertMessage = '';
global.alert = function(msg) {
    alertMessage = msg;
};

// 複製必要的函式
let expenses = [];

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
    console.log('個人記帳本已載入，載入了', expenses.length, '筆記錄');
    
    updateTotalDisplay();
    
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addExpense);
        console.log('新增按鈕事件監聽器已綁定');
    } else {
        console.error('找不到新增按鈕元素');
    }
}

// 測試函式
function runTests() {
    console.log('\n=== 單元測試：事件監聽器綁定 ===\n');
    console.log('**Validates: Requirements 4.1**\n');
    
    let allPassed = true;
    
    // 測試 1: init() 應該綁定事件監聽器
    console.log('測試 1：init() 應該綁定事件監聽器...');
    eventListeners = {};
    init();
    const test1 = eventListeners['click'] && eventListeners['click'].length > 0;
    if (test1) {
        console.log(`✓ 通過 - 已綁定 ${eventListeners['click'].length} 個 click 事件監聽器`);
    } else {
        console.log(`✗ 失敗 - 未綁定 click 事件監聽器`);
        allPassed = false;
    }
    
    // 測試 2: 點擊按鈕應該觸發 addExpense
    console.log('\n測試 2：點擊按鈕應該觸發 addExpense...');
    expenses = [];
    document.amountInput.value = '100';
    document.categorySelect.value = '飲食';
    const lengthBefore = expenses.length;
    document.addBtn.click();
    const lengthAfter = expenses.length;
    const test2 = lengthAfter === lengthBefore + 1;
    if (test2) {
        console.log(`✓ 通過 - 點擊按鈕成功新增記錄, 清單長度: ${lengthBefore} -> ${lengthAfter}`);
    } else {
        console.log(`✗ 失敗 - 點擊按鈕未新增記錄, 清單長度: ${lengthBefore} -> ${lengthAfter}`);
        allPassed = false;
    }
    
    // 測試 3: 點擊按鈕應該更新總計
    console.log('\n測試 3：點擊按鈕應該更新總計...');
    expenses = [];
    document.totalElement.textContent = '今日總計：0 元';
    document.amountInput.value = '50';
    document.categorySelect.value = '交通';
    document.addBtn.click();
    const test3 = document.totalElement.textContent === '今日總計：50 元';
    if (test3) {
        console.log(`✓ 通過 - 總計已更新: ${document.totalElement.textContent}`);
    } else {
        console.log(`✗ 失敗 - 總計未正確更新, 實際: ${document.totalElement.textContent}`);
        allPassed = false;
    }
    
    // 測試 4: 點擊按鈕應該清空輸入
    console.log('\n測試 4：點擊按鈕應該清空輸入...');
    expenses = [];
    document.amountInput.value = '200';
    document.categorySelect.value = '娛樂';
    document.addBtn.click();
    const test4 = document.amountInput.value === '';
    if (test4) {
        console.log(`✓ 通過 - 輸入欄位已清空`);
    } else {
        console.log(`✗ 失敗 - 輸入欄位未清空, 值為: ${document.amountInput.value}`);
        allPassed = false;
    }
    
    // 測試 5: 無效輸入應該顯示警告
    console.log('\n測試 5：無效輸入應該顯示警告...');
    expenses = [];
    alertMessage = '';
    document.amountInput.value = '';
    document.categorySelect.value = '飲食';
    const lengthBefore5 = expenses.length;
    document.addBtn.click();
    const lengthAfter5 = expenses.length;
    const test5 = lengthAfter5 === lengthBefore5 && alertMessage === '請輸入金額';
    if (test5) {
        console.log(`✓ 通過 - 顯示警告: ${alertMessage}`);
    } else {
        console.log(`✗ 失敗 - 預期顯示「請輸入金額」, 實際: ${alertMessage}`);
        allPassed = false;
    }
    
    // 測試 6: 模擬 DOMContentLoaded 事件
    console.log('\n測試 6：模擬 DOMContentLoaded 事件...');
    eventListeners = {};
    expenses = [];
    localStorage.data = { expenses: JSON.stringify([{ id: '1', amount: 100, category: '飲食' }]) };
    
    // 模擬 DOMContentLoaded
    document.addEventListener('DOMContentLoaded', init);
    
    const test6 = eventListeners['click'] && eventListeners['click'].length > 0 && expenses.length === 1;
    if (test6) {
        console.log(`✓ 通過 - DOMContentLoaded 觸發 init(), 載入 ${expenses.length} 筆記錄並綁定事件`);
    } else {
        console.log(`✗ 失敗 - DOMContentLoaded 未正確執行`);
        allPassed = false;
    }
    
    // 總結
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
        console.log('✓ 所有單元測試通過！\n');
        process.exit(0);
    } else {
        console.log('✗ 部分單元測試失敗\n');
        process.exit(1);
    }
}

// 執行測試
runTests();
