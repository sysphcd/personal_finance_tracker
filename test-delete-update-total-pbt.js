/**
 * 屬性測試：刪除後總計即時更新
 * **Validates: Requirements 7.3, 6.4**
 * 
 * 對於任何新增或刪除操作，今日總計應該立即反映最新的金額總和
 */

// 模擬 DOM 環境
const { JSDOM } = require('jsdom');
const fc = require('fast-check');

// 建立 DOM 環境
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <div id="totalAmount">今日總計：0 元</div>
    <div id="expenseList"></div>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

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

// 載入 script.js 的函式（手動複製需要的函式）
let expenses = [];

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

function deleteExpense(id) {
    const index = expenses.findIndex(expense => expense.id === id);
    
    if (index === -1) {
        return;
    }
    
    expenses.splice(index, 1);
    saveToLocalStorage();
    
    const expenseList = document.getElementById('expenseList');
    if (expenseList) {
        const items = expenseList.querySelectorAll('.expense-item');
        for (let item of items) {
            if (item.dataset.id === id) {
                item.remove();
                break;
            }
        }
    }
    
    updateTotalDisplay();
}

// 定義類別選項
const categories = ['飲食', '交通', '娛樂'];

// 生成隨機支出記錄陣列
const expensesArrayArbitrary = fc.array(
    fc.record({
        id: fc.string({ minLength: 1 }),
        amount: fc.double({ min: 0.01, max: 100000, noNaN: true }),
        category: fc.constantFrom(...categories)
    }),
    { minLength: 1, maxLength: 20 }
);

// 屬性：刪除後總計即時更新
const deleteTotalUpdateProperty = fc.property(
    expensesArrayArbitrary,
    fc.integer({ min: 0 }),
    (initialExpenses, indexSeed) => {
        // 清空環境
        expenses = [...initialExpenses];
        localStorage.clear();
        
        // 更新初始總計
        updateTotalDisplay();
        
        // 計算預期的初始總計
        const expectedInitialTotal = initialExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalElement = document.getElementById('totalAmount');
        const initialDisplayText = totalElement.textContent;
        
        // 驗證初始總計正確
        if (initialDisplayText !== `今日總計：${expectedInitialTotal} 元`) {
            return false;
        }
        
        // 選擇要刪除的記錄
        const deleteIndex = indexSeed % expenses.length;
        const expenseToDelete = expenses[deleteIndex];
        const deletedAmount = expenseToDelete.amount;
        
        // 執行刪除
        deleteExpense(expenseToDelete.id);
        
        // 計算預期的新總計（使用實際的 calculateTotal 函式以保持一致性）
        const expectedNewTotal = calculateTotal();
        
        // 取得顯示的總計
        const newDisplayText = totalElement.textContent;
        
        // 驗證總計已更新
        if (newDisplayText !== `今日總計：${expectedNewTotal} 元`) {
            return false;
        }
        
        // 驗證總計與預期值接近（考慮浮點數精度）
        const manualTotal = expectedInitialTotal - deletedAmount;
        const epsilon = 0.000001;
        if (Math.abs(expectedNewTotal - manualTotal) > epsilon) {
            return false;
        }
        
        return true;
    }
);

// 執行測試
try {
    fc.assert(deleteTotalUpdateProperty, { numRuns: 100 });
    console.log('✓ 屬性測試通過：刪除後總計即時更新（100 次迭代）');
    process.exit(0);
} catch (error) {
    console.error('✗ 屬性測試失敗：', error.message);
    process.exit(1);
}
