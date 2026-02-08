#!/usr/bin/env node

/**
 * 屬性測試：新增有效記錄增加清單長度
 * 
 * **Validates: Requirements 4.1**
 * 
 * 屬性 1：新增有效記錄增加清單長度
 * 對於任何有效的金額（> 0）和類別，新增支出記錄後，
 * 清單中的記錄數量應該增加 1
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
        id: Date.now().toString() + Math.random(), // 確保唯一性
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

// 定義有效金額的生成器（> 0）
const validAmountArbitrary = fc.double({ 
    min: 0.01, 
    max: 999999.99, 
    noNaN: true,
    noDefaultInfinity: true
});

// 定義類別的生成器
const categoryArbitrary = fc.constantFrom('飲食', '交通', '娛樂');

// 定義初始支出記錄陣列的生成器（用於測試不同的初始狀態）
const expenseArbitrary = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    amount: fc.double({ min: 0.01, max: 999999.99, noNaN: true }),
    category: categoryArbitrary
});

const initialExpensesArbitrary = fc.array(expenseArbitrary, { minLength: 0, maxLength: 50 });

console.log('=== 屬性測試：新增有效記錄增加清單長度 ===\n');
console.log('**Validates: Requirements 4.1**\n');
console.log('屬性 1：對於任何有效的金額（> 0）和類別，新增支出記錄後，');
console.log('清單中的記錄數量應該增加 1\n');

// 執行屬性測試
const result = fc.check(
    fc.property(
        initialExpensesArbitrary,
        validAmountArbitrary,
        categoryArbitrary,
        (initialExpenses, amount, category) => {
            // 清空並設定初始狀態
            localStorage.clear();
            expenses = [...initialExpenses]; // 複製陣列以避免修改原始資料
            
            // 記錄新增前的長度
            const lengthBefore = expenses.length;
            
            // 新增支出記錄
            const success = addExpense(amount, category);
            
            // 驗證新增成功
            if (!success) {
                console.error(`新增失敗：金額 ${amount}，類別 ${category}`);
                return false;
            }
            
            // 記錄新增後的長度
            const lengthAfter = expenses.length;
            
            // 驗證長度增加 1
            if (lengthAfter !== lengthBefore + 1) {
                console.error(`長度不正確：預期 ${lengthBefore + 1}，實際 ${lengthAfter}`);
                return false;
            }
            
            // 驗證新增的記錄包含正確的金額和類別
            const lastExpense = expenses[expenses.length - 1];
            if (Math.abs(lastExpense.amount - amount) > 0.001) {
                console.error(`金額不正確：預期 ${amount}，實際 ${lastExpense.amount}`);
                return false;
            }
            
            if (lastExpense.category !== category) {
                console.error(`類別不正確：預期 '${category}'，實際 '${lastExpense.category}'`);
                return false;
            }
            
            // 驗證 localStorage 也被更新
            const storedExpenses = JSON.parse(localStorage.getItem('expenses'));
            if (storedExpenses.length !== lengthAfter) {
                console.error(`localStorage 長度不正確：預期 ${lengthAfter}，實際 ${storedExpenses.length}`);
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
