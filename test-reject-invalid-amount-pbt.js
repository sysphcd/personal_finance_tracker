#!/usr/bin/env node

/**
 * 屬性測試：拒絕無效金額
 * 
 * **Validates: Requirements 4.3**
 * 
 * 屬性 3：拒絕無效金額
 * 對於任何小於或等於零的金額，嘗試新增時系統應該拒絕並保持清單不變
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

// 全域變數
let expenses = [];

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
 * 新增支出記錄（簡化版，不需要 DOM）
 */
function addExpense(amount, category) {
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
    
    return true; // 新增成功
}

// 定義無效金額的生成器（<= 0）
const invalidAmountArbitrary = fc.oneof(
    // 負數
    fc.double({ min: -999999.99, max: -0.01, noNaN: true }),
    // 零
    fc.constant(0),
    // 非常接近零的負數
    fc.double({ min: -0.0001, max: -0.000001, noNaN: true })
);

// 定義類別的生成器
const categoryArbitrary = fc.constantFrom('飲食', '交通', '娛樂');

// 定義初始支出記錄陣列的生成器
const expenseArbitrary = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    amount: fc.double({ min: 0.01, max: 999999.99, noNaN: true }),
    category: categoryArbitrary
});

const initialExpensesArbitrary = fc.array(expenseArbitrary, { minLength: 0, maxLength: 50 });

console.log('=== 屬性測試：拒絕無效金額 ===\n');
console.log('**Validates: Requirements 4.3**\n');
console.log('屬性 3：對於任何小於或等於零的金額，嘗試新增時系統應該拒絕並保持清單不變\n');

// 執行屬性測試
const result = fc.check(
    fc.property(
        initialExpensesArbitrary,
        invalidAmountArbitrary,
        categoryArbitrary,
        (initialExpenses, amount, category) => {
            // 清空並設定初始狀態
            localStorage.clear();
            expenses = [...initialExpenses]; // 複製陣列
            
            // 儲存初始狀態以便比較
            const lengthBefore = expenses.length;
            const expensesBefore = JSON.stringify(expenses);
            const localStorageBefore = localStorage.getItem('expenses');
            
            // 嘗試新增無效金額的支出記錄
            const success = addExpense(amount, category);
            
            // 驗證新增應該失敗
            if (success) {
                console.error(`新增應該失敗但成功了：金額 ${amount}，類別 ${category}`);
                return false;
            }
            
            // 驗證清單長度沒有改變
            const lengthAfter = expenses.length;
            if (lengthAfter !== lengthBefore) {
                console.error(`清單長度改變了：之前 ${lengthBefore}，之後 ${lengthAfter}`);
                return false;
            }
            
            // 驗證清單內容沒有改變
            const expensesAfter = JSON.stringify(expenses);
            if (expensesAfter !== expensesBefore) {
                console.error('清單內容改變了');
                return false;
            }
            
            // 驗證 localStorage 沒有改變
            const localStorageAfter = localStorage.getItem('expenses');
            if (localStorageAfter !== localStorageBefore) {
                console.error('localStorage 內容改變了');
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
}
console.log('='.repeat(60));
