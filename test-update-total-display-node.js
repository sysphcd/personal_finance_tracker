// 測試 updateTotalDisplay() 函式
// 使用 Node.js 環境模擬 DOM

// 模擬 DOM 環境
const document = {
    getElementById: function(id) {
        if (id === 'totalAmount') {
            return this.totalElement;
        }
        return null;
    },
    totalElement: {
        textContent: '今日總計：0 元'
    }
};

// 複製必要的函式
let expenses = [];

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

// 測試函式
function runTests() {
    const results = [];
    let allPassed = true;
    
    // 測試 1: 空清單應顯示 0 元
    expenses = [];
    updateTotalDisplay();
    const display1 = document.totalElement.textContent;
    const test1 = display1 === '今日總計：0 元';
    results.push(`測試 1 - 空清單顯示 0 元: ${test1 ? '✓ 通過' : '✗ 失敗'} (顯示: ${display1})`);
    allPassed = allPassed && test1;
    
    // 測試 2: 單筆記錄
    expenses = [{ id: '1', amount: 100, category: '飲食' }];
    updateTotalDisplay();
    const display2 = document.totalElement.textContent;
    const test2 = display2 === '今日總計：100 元';
    results.push(`測試 2 - 單筆記錄 100 元: ${test2 ? '✓ 通過' : '✗ 失敗'} (顯示: ${display2})`);
    allPassed = allPassed && test2;
    
    // 測試 3: 多筆記錄
    expenses = [
        { id: '1', amount: 100, category: '飲食' },
        { id: '2', amount: 50, category: '交通' },
        { id: '3', amount: 200, category: '娛樂' }
    ];
    updateTotalDisplay();
    const display3 = document.totalElement.textContent;
    const test3 = display3 === '今日總計：350 元';
    results.push(`測試 3 - 多筆記錄總計 350 元: ${test3 ? '✓ 通過' : '✗ 失敗'} (顯示: ${display3})`);
    allPassed = allPassed && test3;
    
    // 測試 4: 小數金額
    expenses = [
        { id: '1', amount: 99.5, category: '飲食' },
        { id: '2', amount: 50.5, category: '交通' }
    ];
    updateTotalDisplay();
    const display4 = document.totalElement.textContent;
    const test4 = display4 === '今日總計：150 元';
    results.push(`測試 4 - 小數金額總計 150 元: ${test4 ? '✓ 通過' : '✗ 失敗'} (顯示: ${display4})`);
    allPassed = allPassed && test4;
    
    // 顯示結果
    console.log('\n=== 測試 updateTotalDisplay() 函式 ===\n');
    results.forEach(r => console.log(r));
    
    if (allPassed) {
        console.log('\n✓ 所有測試通過！\n');
    } else {
        console.log('\n✗ 部分測試失敗\n');
        process.exit(1);
    }
}

// 執行測試
runTests();
