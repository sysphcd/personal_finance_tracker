/**
 * 屬性測試：顯示格式正確性
 * **Validates: Requirements 4.2**
 * 
 * 對於任何支出記錄，顯示的文字應該包含類別、金額和「元」字，
 * 並符合「分類 - 金額 元」的格式
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

// 生成隨機支出記錄
const expenseArbitrary = fc.record({
    id: fc.string(),
    amount: fc.double({ min: 0.01, max: 100000, noNaN: true }),
    category: fc.constantFrom(...categories)
});

// 屬性：顯示格式正確性
const displayFormatProperty = fc.property(
    expenseArbitrary,
    (expense) => {
        // 清空清單
        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = '';
        
        // 渲染支出記錄
        renderExpense(expense);
        
        // 取得渲染的元素
        const items = expenseList.querySelectorAll('.expense-item');
        
        // 應該有一個項目
        if (items.length !== 1) {
            return false;
        }
        
        // 取得顯示文字
        const textSpan = items[0].querySelector('span');
        if (!textSpan) {
            return false;
        }
        
        const displayText = textSpan.textContent;
        
        // 驗證格式：「分類 - 金額 元」
        // 1. 包含類別
        if (!displayText.includes(expense.category)) {
            return false;
        }
        
        // 2. 包含金額
        if (!displayText.includes(expense.amount.toString())) {
            return false;
        }
        
        // 3. 包含「元」字
        if (!displayText.includes('元')) {
            return false;
        }
        
        // 4. 符合「分類 - 金額 元」的格式
        const expectedFormat = `${expense.category} - ${expense.amount} 元`;
        if (displayText !== expectedFormat) {
            return false;
        }
        
        return true;
    }
);

// 執行測試
try {
    fc.assert(displayFormatProperty, { numRuns: 100 });
    console.log('✓ 屬性測試通過：顯示格式正確性（100 次迭代）');
    process.exit(0);
} catch (error) {
    console.error('✗ 屬性測試失敗：', error.message);
    process.exit(1);
}
