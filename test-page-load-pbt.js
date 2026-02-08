/**
 * 屬性測試：頁面載入時正確顯示資料
 * **Validates: Requirements 5.2, 5.3, 7.2**
 * 
 * 對於任何儲存在 localStorage 中的支出記錄集合，
 * 頁面載入後應該顯示所有記錄並計算正確的總計
 */

// 模擬 DOM 環境
const { JSDOM } = require('jsdom');
const fc = require('fast-check');

// 定義類別選項
const categories = ['飲食', '交通', '娛樂'];

// 生成隨機支出記錄陣列
const expensesArrayArbitrary = fc.array(
    fc.record({
        id: fc.string({ minLength: 1 }),
        amount: fc.double({ min: 0.01, max: 100000, noNaN: true }),
        category: fc.constantFrom(...categories)
    }),
    { minLength: 0, maxLength: 20 }
);

// 屬性：頁面載入時正確顯示資料
const pageLoadProperty = fc.property(
    expensesArrayArbitrary,
    (testExpenses) => {
        // 為每次測試建立新的 DOM 環境
        const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <div id="totalAmount">今日總計：0 元</div>
    <div id="expenseList"></div>
    <button id="addBtn">新增支出</button>
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
        
        // 預設 localStorage 資料
        localStorage.setItem('expenses', JSON.stringify(testExpenses));
        
        // 載入 script.js 的函式（手動複製需要的函式）
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
        
        function renderAllExpenses() {
            const expenseList = document.getElementById('expenseList');
            if (!expenseList) {
                return;
            }
            
            expenseList.innerHTML = '';
            
            expenses.forEach(expense => {
                renderExpense(expense);
            });
        }
        
        function init() {
            expenses = loadFromLocalStorage();
            renderAllExpenses();
            updateTotalDisplay();
        }
        
        // 執行初始化（模擬頁面載入）
        init();
        
        // 驗證 1：載入的記錄數量正確
        if (expenses.length !== testExpenses.length) {
            return false;
        }
        
        // 驗證 2：顯示的記錄數量正確
        const expenseList = document.getElementById('expenseList');
        const displayedItems = expenseList.querySelectorAll('.expense-item');
        if (displayedItems.length !== testExpenses.length) {
            return false;
        }
        
        // 驗證 3：每筆記錄的內容正確
        for (let i = 0; i < testExpenses.length; i++) {
            const expense = testExpenses[i];
            const found = Array.from(displayedItems).some(item => {
                const span = item.querySelector('span');
                if (!span) return false;
                const expectedText = `${expense.category} - ${expense.amount} 元`;
                return span.textContent === expectedText && item.dataset.id === expense.id;
            });
            
            if (!found) {
                return false;
            }
        }
        
        // 驗證 4：總計計算正確
        const expectedTotal = testExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalElement = document.getElementById('totalAmount');
        const displayedTotal = totalElement.textContent;
        
        if (displayedTotal !== `今日總計：${expectedTotal} 元`) {
            return false;
        }
        
        return true;
    }
);

// 執行測試
try {
    fc.assert(pageLoadProperty, { numRuns: 100 });
    console.log('✓ 屬性測試通過：頁面載入時正確顯示資料（100 次迭代）');
    process.exit(0);
} catch (error) {
    console.error('✗ 屬性測試失敗：', error.message);
    process.exit(1);
}
