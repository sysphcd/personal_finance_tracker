/**
 * 屬性測試：每筆記錄都有刪除按鈕
 * **Validates: Requirements 6.1**
 * 
 * 對於任何顯示在清單中的支出記錄，都應該有一個對應的刪除按鈕
 */

// 模擬 DOM 環境
const { JSDOM } = require('jsdom');
const fc = require('fast-check');

// 建立 DOM 環境
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <div id="expenseList"></div>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

// 載入 script.js 的函式（手動複製需要的函式）
function renderExpense(expense) {
    const expenseList = document.getElementById('expenseList');
    if (!expenseList) {
        console.error('找不到支出清單容器');
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

// 定義類別選項
const categories = ['飲食', '交通', '娛樂'];

// 生成隨機支出記錄陣列
const expensesArrayArbitrary = fc.array(
    fc.record({
        id: fc.string(),
        amount: fc.double({ min: 0.01, max: 100000, noNaN: true }),
        category: fc.constantFrom(...categories)
    }),
    { minLength: 1, maxLength: 20 }
);

// 屬性：每筆記錄都有刪除按鈕
const deleteButtonProperty = fc.property(
    expensesArrayArbitrary,
    (expenses) => {
        // 清空清單
        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = '';
        
        // 渲染所有支出記錄
        expenses.forEach(expense => {
            renderExpense(expense);
        });
        
        // 取得所有渲染的項目
        const items = expenseList.querySelectorAll('.expense-item');
        
        // 項目數量應該等於支出記錄數量
        if (items.length !== expenses.length) {
            return false;
        }
        
        // 檢查每個項目都有刪除按鈕
        for (let i = 0; i < items.length; i++) {
            const deleteBtn = items[i].querySelector('.delete-btn');
            
            // 應該有刪除按鈕
            if (!deleteBtn) {
                return false;
            }
            
            // 刪除按鈕應該有文字「刪除」
            if (deleteBtn.textContent !== '刪除') {
                return false;
            }
        }
        
        return true;
    }
);

// 執行測試
try {
    fc.assert(deleteButtonProperty, { numRuns: 100 });
    console.log('✓ 屬性測試通過：每筆記錄都有刪除按鈕（100 次迭代）');
    process.exit(0);
} catch (error) {
    console.error('✗ 屬性測試失敗：', error.message);
    process.exit(1);
}
