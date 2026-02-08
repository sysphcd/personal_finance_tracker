#!/usr/bin/env node

/**
 * 單元測試：addExpense() 函式
 * **Validates: Requirements 4.1, 4.5, 4.6, 5.1, 7.3**
 * 
 * 測試 addExpense() 函式正確新增支出記錄
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
const document = {
    getElementById: function(id) {
        if (id === 'amountInput') {
            return this.amountInput;
        } else if (id === 'categorySelect') {
            return this.categorySelect;
        } else if (id === 'totalAmount') {
            return this.totalElement;
        }
        return null;
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
    }
};

// 模擬 alert
let alertMessage = '';
global.alert = function(msg) {
    alertMessage = msg;
};

// 複製必要的函式
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

// 測試函式
function runTests() {
    console.log('\n=== 單元測試：addExpense() 函式 ===\n');
    console.log('**Validates: Requirements 4.1, 4.5, 4.6, 5.1, 7.3**\n');
    
    let allPassed = true;
    
    // 測試 1: 新增有效記錄應該增加清單長度
    console.log('測試 1：新增有效記錄應該增加清單長度...');
    expenses = [];
    localStorage.clear();
    document.amountInput.value = '100';
    document.categorySelect.value = '飲食';
    const lengthBefore = expenses.length;
    addExpense();
    const lengthAfter = expenses.length;
    const test1 = lengthAfter === lengthBefore + 1;
    if (test1) {
        console.log(`✓ 通過 - 清單長度從 ${lengthBefore} 增加到 ${lengthAfter}`);
    } else {
        console.log(`✗ 失敗 - 預期長度增加 1, 實際: ${lengthBefore} -> ${lengthAfter}`);
        allPassed = false;
    }
    
    // 測試 2: 新增記錄應該儲存到 localStorage
    console.log('\n測試 2：新增記錄應該儲存到 localStorage...');
    expenses = [];
    localStorage.clear();
    document.amountInput.value = '50';
    document.categorySelect.value = '交通';
    addExpense();
    const savedData = localStorage.getItem('expenses');
    const test2 = savedData !== null && savedData !== '';
    if (test2) {
        const parsed = JSON.parse(savedData);
        console.log(`✓ 通過 - localStorage 包含 ${parsed.length} 筆記錄`);
    } else {
        console.log(`✗ 失敗 - localStorage 沒有儲存資料`);
        allPassed = false;
    }
    
    // 測試 3: 新增後應該清空輸入欄位
    console.log('\n測試 3：新增後應該清空輸入欄位...');
    expenses = [];
    document.amountInput.value = '200';
    document.categorySelect.value = '娛樂';
    addExpense();
    const test3 = document.amountInput.value === '';
    if (test3) {
        console.log(`✓ 通過 - 輸入欄位已清空`);
    } else {
        console.log(`✗ 失敗 - 輸入欄位未清空, 值為: ${document.amountInput.value}`);
        allPassed = false;
    }
    
    // 測試 4: 新增後應該重置下拉選單
    console.log('\n測試 4：新增後應該重置下拉選單...');
    expenses = [];
    document.amountInput.value = '150';
    document.categorySelect.value = '交通';
    document.categorySelect.selectedIndex = 1;
    addExpense();
    const test4 = document.categorySelect.selectedIndex === 0;
    if (test4) {
        console.log(`✓ 通過 - 下拉選單已重置到第一個選項`);
    } else {
        console.log(`✗ 失敗 - 下拉選單未重置, selectedIndex: ${document.categorySelect.selectedIndex}`);
        allPassed = false;
    }
    
    // 測試 5: 新增後應該更新總計顯示
    console.log('\n測試 5：新增後應該更新總計顯示...');
    expenses = [];
    document.totalElement.textContent = '今日總計：0 元';
    document.amountInput.value = '100';
    document.categorySelect.value = '飲食';
    addExpense();
    const test5 = document.totalElement.textContent === '今日總計：100 元';
    if (test5) {
        console.log(`✓ 通過 - 總計顯示: ${document.totalElement.textContent}`);
    } else {
        console.log(`✗ 失敗 - 預期「今日總計：100 元」, 實際: ${document.totalElement.textContent}`);
        allPassed = false;
    }
    
    // 測試 6: 空值輸入應該被拒絕
    console.log('\n測試 6：空值輸入應該被拒絕...');
    expenses = [];
    alertMessage = '';
    document.amountInput.value = '';
    document.categorySelect.value = '飲食';
    const lengthBefore6 = expenses.length;
    addExpense();
    const lengthAfter6 = expenses.length;
    const test6 = lengthAfter6 === lengthBefore6 && alertMessage === '請輸入金額';
    if (test6) {
        console.log(`✓ 通過 - 拒絕空值並顯示警告: ${alertMessage}`);
    } else {
        console.log(`✗ 失敗 - 預期拒絕並顯示「請輸入金額」, 實際: ${alertMessage}, 長度變化: ${lengthBefore6} -> ${lengthAfter6}`);
        allPassed = false;
    }
    
    // 測試 7: 零或負數應該被拒絕
    console.log('\n測試 7：零或負數應該被拒絕...');
    expenses = [];
    alertMessage = '';
    document.amountInput.value = '0';
    document.categorySelect.value = '飲食';
    const lengthBefore7 = expenses.length;
    addExpense();
    const lengthAfter7 = expenses.length;
    const test7 = lengthAfter7 === lengthBefore7 && alertMessage === '金額必須大於 0';
    if (test7) {
        console.log(`✓ 通過 - 拒絕零並顯示警告: ${alertMessage}`);
    } else {
        console.log(`✗ 失敗 - 預期拒絕並顯示「金額必須大於 0」, 實際: ${alertMessage}, 長度變化: ${lengthBefore7} -> ${lengthAfter7}`);
        allPassed = false;
    }
    
    // 測試 8: 多次新增應該累積記錄
    console.log('\n測試 8：多次新增應該累積記錄...');
    expenses = [];
    document.amountInput.value = '100';
    addExpense();
    document.amountInput.value = '50';
    addExpense();
    document.amountInput.value = '200';
    addExpense();
    const test8 = expenses.length === 3 && calculateTotal() === 350;
    if (test8) {
        console.log(`✓ 通過 - 累積 ${expenses.length} 筆記錄, 總計 ${calculateTotal()} 元`);
    } else {
        console.log(`✗ 失敗 - 預期 3 筆記錄總計 350 元, 實際: ${expenses.length} 筆, ${calculateTotal()} 元`);
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
