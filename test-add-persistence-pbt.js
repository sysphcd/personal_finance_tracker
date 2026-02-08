#!/usr/bin/env node

/**
 * 屬性測試：新增操作立即持久化
 * 
 * **Validates: Requirements 5.1**
 * 
 * 屬性 6：新增操作立即持久化
 * 對於任何新增的支出記錄，localStorage 中應該立即包含該記錄
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
 * 從 localStorage 載入支出記錄陣列
 */
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
        return null; // 新增失敗
    }
    
    // 建立新的支出記錄物件
    const newExpense = createExpense(amount, category);
    
    // 將記錄加入資料陣列
    expenses.push(newExpense);
    
    // 儲存到 localStorage
    saveToLocalStorage();
    
    return newExpense; // 返回新增的記錄
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

// 定義初始支出記錄陣列的生成器
const expenseArbitrary = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    amount: fc.double({ min: 0.01, max: 999999.99, noNaN: true }),
    category: categoryArbitrary
});

const initialExpensesArbitrary = fc.array(expenseArbitrary, { minLength: 0, maxLength: 50 });

console.log('=== 屬性測試：新增操作立即持久化 ===\n');
console.log('**Validates: Requirements 5.1**\n');
console.log('屬性 6：對於任何新增的支出記錄，localStorage 中應該立即包含該記錄\n');

// 執行屬性測試
const result = fc.check(
    fc.property(
        initialExpensesArbitrary,
        validAmountArbitrary,
        categoryArbitrary,
        (initialExpenses, amount, category) => {
            // 清空並設定初始狀態
            localStorage.clear();
            expenses = [...initialExpenses]; // 複製陣列
            
            // 如果有初始資料，先儲存到 localStorage
            if (initialExpenses.length > 0) {
                saveToLocalStorage();
            }
            
            // 新增支出記錄
            const newExpense = addExpense(amount, category);
            
            // 驗證新增成功
            if (!newExpense) {
                console.error(`新增失敗：金額 ${amount}，類別 ${category}`);
                return false;
            }
            
            // 立即從 localStorage 載入資料
            const loadedExpenses = loadFromLocalStorage();
            
            // 驗證 localStorage 中的記錄數量正確
            const expectedLength = initialExpenses.length + 1;
            if (loadedExpenses.length !== expectedLength) {
                console.error(`localStorage 中的記錄數量不正確：預期 ${expectedLength}，實際 ${loadedExpenses.length}`);
                return false;
            }
            
            // 驗證新增的記錄存在於 localStorage 中
            const foundInLocalStorage = loadedExpenses.some(exp => {
                return exp.id === newExpense.id &&
                       Math.abs(exp.amount - newExpense.amount) < 0.001 &&
                       exp.category === newExpense.category;
            });
            
            if (!foundInLocalStorage) {
                console.error('新增的記錄未在 localStorage 中找到');
                console.error('新增的記錄：', newExpense);
                console.error('localStorage 中的記錄：', loadedExpenses);
                return false;
            }
            
            // 驗證所有初始記錄仍然存在
            for (const initialExpense of initialExpenses) {
                const foundInitial = loadedExpenses.some(exp => {
                    return exp.id === initialExpense.id &&
                           Math.abs(exp.amount - initialExpense.amount) < 0.001 &&
                           exp.category === initialExpense.category;
                });
                
                if (!foundInitial) {
                    console.error('初始記錄在 localStorage 中遺失');
                    console.error('遺失的記錄：', initialExpense);
                    return false;
                }
            }
            
            // 驗證 localStorage 中的資料與 expenses 陣列一致
            if (loadedExpenses.length !== expenses.length) {
                console.error('localStorage 與 expenses 陣列長度不一致');
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
    console.log('✓ 新增記錄後 localStorage 立即包含該記錄');
    console.log('✓ localStorage 中的記錄數量正確');
    console.log('✓ 新增的記錄資料（id、金額、類別）正確儲存');
    console.log('✓ 初始記錄在新增後仍然保留');
    console.log('✓ localStorage 與 expenses 陣列保持一致');
}
console.log('='.repeat(60));
