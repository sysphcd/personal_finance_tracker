#!/usr/bin/env node

/**
 * 屬性測試：localStorage 往返一致性
 * 
 * **Validates: Requirements 5.5**
 * 
 * 屬性 5：localStorage 往返一致性
 * 對於任何支出記錄陣列，儲存到 localStorage 後再載入，
 * 應該得到相同的資料（保留金額和類別資訊）
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

// 定義支出記錄的生成器
const expenseArbitrary = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    amount: fc.double({ min: 0.01, max: 999999.99, noNaN: true }),
    category: fc.constantFrom('飲食', '交通', '娛樂')
});

// 定義支出記錄陣列的生成器
const expensesArrayArbitrary = fc.array(expenseArbitrary, { minLength: 0, maxLength: 100 });

console.log('=== 屬性測試：localStorage 往返一致性 ===\n');
console.log('**Validates: Requirements 5.5**\n');
console.log('屬性 5：對於任何支出記錄陣列，儲存到 localStorage 後再載入，');
console.log('應該得到相同的資料（保留金額和類別資訊）\n');

// 執行屬性測試
const result = fc.check(
    fc.property(expensesArrayArbitrary, (testExpenses) => {
        // 清空 localStorage
        localStorage.clear();
        
        // 設定 expenses 陣列
        expenses = testExpenses;
        
        // 儲存到 localStorage
        saveToLocalStorage();
        
        // 從 localStorage 載入
        const loadedExpenses = loadFromLocalStorage();
        
        // 驗證陣列長度相同
        if (loadedExpenses.length !== testExpenses.length) {
            console.error(`長度不一致：預期 ${testExpenses.length}，實際 ${loadedExpenses.length}`);
            return false;
        }
        
        // 驗證每筆記錄的資料一致性
        for (let i = 0; i < testExpenses.length; i++) {
            const original = testExpenses[i];
            const loaded = loadedExpenses[i];
            
            // 驗證 id
            if (loaded.id !== original.id) {
                console.error(`記錄 ${i} 的 id 不一致：預期 '${original.id}'，實際 '${loaded.id}'`);
                return false;
            }
            
            // 驗證 amount（考慮浮點數精度）
            if (Math.abs(loaded.amount - original.amount) > 0.001) {
                console.error(`記錄 ${i} 的 amount 不一致：預期 ${original.amount}，實際 ${loaded.amount}`);
                return false;
            }
            
            // 驗證 category
            if (loaded.category !== original.category) {
                console.error(`記錄 ${i} 的 category 不一致：預期 '${original.category}'，實際 '${loaded.category}'`);
                return false;
            }
        }
        
        return true;
    }),
    { numRuns: 100, verbose: true }
);

// 輸出測試結果
console.log('\n' + '='.repeat(60));
if (result.failed) {
    console.log('❌ 屬性測試失敗！');
    console.log('反例：', JSON.stringify(result.counterexample, null, 2));
    console.log('錯誤：', result.error);
    process.exit(1);
} else {
    console.log('✅ 屬性測試通過！');
    console.log(`執行了 ${result.numRuns} 次測試，所有測試都通過。`);
}
console.log('='.repeat(60));
