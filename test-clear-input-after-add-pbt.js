#!/usr/bin/env node

/**
 * 屬性測試：成功新增後清空輸入
 * 
 * **Validates: Requirements 4.5, 4.6**
 * 
 * 屬性 4：成功新增後清空輸入
 * 對於任何有效的支出記錄，成功新增後，金額輸入欄位應該被清空，
 * 類別下拉選單應該重置為第一個選項
 */

// 導入 fast-check 進行屬性測試
const fc = require('fast-check');

// 模擬 localStorage（Node.js 環境）
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = value.toString();
    }

    removeItem(key) {
        delete this.store[key];
    }

    clear() {
        this.store = {};
    }
}

// 設定全域 localStorage
global.localStorage = new LocalStorageMock();

// 模擬 DOM 元素
class MockInputElement {
    constructor() {
        this.value = '';
    }
}

class MockSelectElement {
    constructor() {
        this.value = '飲食';
        this.selectedIndex = 0;
        this.options = [
            { value: '飲食' },
            { value: '交通' },
            { value: '娛樂' }
        ];
    }
}

// 全域變數
let expenses = [];
let mockAmountInput = null;
let mockCategorySelect = null;

// 模擬 document.getElementById
const mockElements = {};

function getElementById(id) {
    return mockElements[id] || null;
}

/**
 * 建立支出記錄物件
 */
function createExpense(amount, category) {
    return {
        id: Date.now().toString() + Math.random(),
        amount: parseFloat(amount),
        category: category
    };
}

/**
 * 儲存支出記錄陣列到 localStorage
 */
function saveToLocalStorage() {
    try {
        const jsonString = JSON.stringify(expenses);
        localStorage.setItem('expenses', jsonString);
    } catch (error) {
        console.error('儲存到 localStorage 失敗:', error);
        throw error;
    }
}

/**
 * 驗證輸入的金額是否有效
 */
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

/**
 * 新增支出記錄（模擬完整的 DOM 互動）
 */
function addExpense() {
    // 取得輸入元素
    const amountInput = getElementById('amountInput');
    const categorySelect = getElementById('categorySelect');
    
    if (!amountInput || !categorySelect) {
        console.error('找不到輸入元素');
        return false;
    }
    
    // 取得輸入值
    const amount = amountInput.value;
    const category = categorySelect.value;
    
    // 驗證輸入
    const validation = validateInput(amount);
    if (!validation.valid) {
        return false; // 新增失敗
    }
    
    // 建立新的支出記錄物件
    const newExpense = createExpense(amount, category);
    
    // 將記錄加入資料陣列
    expenses.push(newExpense);
    
    // 儲存到 localStorage
    saveToLocalStorage();
    
    // 清空輸入欄位
    amountInput.value = '';
    
    // 重置下拉選單到第一個選項
    categorySelect.selectedIndex = 0;
    categorySelect.value = categorySelect.options[0].value;
    
    return true; // 新增成功
}

// 定義有效金額的生成器
const validAmountArbitrary = fc.double({ 
    min: 0.01, 
    max: 999999.99, 
    noNaN: true,
    noDefaultInfinity: true
});

// 定義類別的生成器
const categoryArbitrary = fc.constantFrom('飲食', '交通', '娛樂');

console.log('=== 屬性測試：成功新增後清空輸入 ===\n');
console.log('**Validates: Requirements 4.5, 4.6**\n');
console.log('屬性 4：對於任何有效的支出記錄，成功新增後，');
console.log('金額輸入欄位應該被清空，類別下拉選單應該重置為第一個選項\n');

// 執行屬性測試
const result = fc.check(
    fc.property(
        validAmountArbitrary,
        categoryArbitrary,
        (amount, category) => {
            // 清空並設定初始狀態
            localStorage.clear();
            expenses = [];
            
            // 建立新的模擬 DOM 元素
            mockAmountInput = new MockInputElement();
            mockCategorySelect = new MockSelectElement();
            
            mockElements['amountInput'] = mockAmountInput;
            mockElements['categorySelect'] = mockCategorySelect;
            
            // 設定輸入值
            mockAmountInput.value = amount.toString();
            
            // 設定類別
            const categoryIndex = mockCategorySelect.options.findIndex(opt => opt.value === category);
            if (categoryIndex !== -1) {
                mockCategorySelect.selectedIndex = categoryIndex;
                mockCategorySelect.value = category;
            }
            
            // 呼叫 addExpense 函式
            const success = addExpense();
            
            // 驗證新增成功
            if (!success) {
                console.error(`新增失敗：金額 ${amount}，類別 ${category}`);
                return false;
            }
            
            // 驗證金額輸入欄位被清空
            if (mockAmountInput.value !== '') {
                console.error(`金額輸入欄位未被清空：'${mockAmountInput.value}'`);
                return false;
            }
            
            // 驗證類別下拉選單重置為第一個選項
            if (mockCategorySelect.selectedIndex !== 0) {
                console.error(`類別下拉選單未重置：索引 ${mockCategorySelect.selectedIndex}，應為 0`);
                return false;
            }
            
            if (mockCategorySelect.value !== '飲食') {
                console.error(`類別下拉選單值未重置：'${mockCategorySelect.value}'，應為 '飲食'`);
                return false;
            }
            
            // 驗證記錄確實被新增
            if (expenses.length !== 1) {
                console.error(`記錄數量不正確：預期 1，實際 ${expenses.length}`);
                return false;
            }
            
            // 驗證新增的記錄包含正確的資料
            const addedExpense = expenses[0];
            if (Math.abs(addedExpense.amount - amount) > 0.001) {
                console.error(`新增的金額不正確：預期 ${amount}，實際 ${addedExpense.amount}`);
                return false;
            }
            
            if (addedExpense.category !== category) {
                console.error(`新增的類別不正確：預期 '${category}'，實際 '${addedExpense.category}'`);
                return false;
            }
            
            return true;
        }
    ),
    { numRuns: 100, verbose: true }
);

// 輸出測試結果
console.log('\n' + '='.repeat(60));
if (result.failed) {
    console.log('❌ 屬性測試失敗！');
    console.log('反例：', JSON.stringify(result.counterexample, null, 2));
    if (result.error) {
        console.log('錯誤：', result.error);
    }
    process.exit(1);
} else {
    console.log('✅ 屬性測試通過！');
    console.log(`執行了 ${result.numRuns} 次測試，所有測試都通過。`);
    console.log('\n驗證項目：');
    console.log('✓ 金額輸入欄位在新增後被清空');
    console.log('✓ 類別下拉選單在新增後重置為第一個選項');
    console.log('✓ 記錄成功新增到 expenses 陣列');
    console.log('✓ 新增的記錄包含正確的金額和類別');
}
console.log('='.repeat(60));
