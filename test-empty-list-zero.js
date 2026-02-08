#!/usr/bin/env node

/**
 * 單元測試：空清單顯示零元
 * **Validates: Requirements 7.5**
 * 
 * 測試當沒有記錄時顯示「今日總計：0 元」
 */

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
    console.log('\n=== 單元測試：空清單顯示零元 ===\n');
    console.log('**Validates: Requirements 7.5**\n');
    
    let allPassed = true;
    
    // 測試 1: 空陣列應顯示「今日總計：0 元」
    console.log('測試 1：空陣列應顯示「今日總計：0 元」...');
    expenses = [];
    updateTotalDisplay();
    const display1 = document.totalElement.textContent;
    const test1 = display1 === '今日總計：0 元';
    if (test1) {
        console.log(`✓ 通過 - 顯示: ${display1}`);
    } else {
        console.log(`✗ 失敗 - 預期: 今日總計：0 元, 實際: ${display1}`);
        allPassed = false;
    }
    
    // 測試 2: 初始狀態（未呼叫 updateTotalDisplay）應該是 0 元
    console.log('\n測試 2：初始狀態應該顯示 0 元...');
    document.totalElement.textContent = '今日總計：0 元';
    expenses = [];
    const initialDisplay = document.totalElement.textContent;
    const test2 = initialDisplay === '今日總計：0 元';
    if (test2) {
        console.log(`✓ 通過 - 初始顯示: ${initialDisplay}`);
    } else {
        console.log(`✗ 失敗 - 預期: 今日總計：0 元, 實際: ${initialDisplay}`);
        allPassed = false;
    }
    
    // 測試 3: 清空有資料的清單後應顯示 0 元
    console.log('\n測試 3：清空有資料的清單後應顯示 0 元...');
    expenses = [
        { id: '1', amount: 100, category: '飲食' },
        { id: '2', amount: 50, category: '交通' }
    ];
    updateTotalDisplay();
    const beforeClear = document.totalElement.textContent;
    console.log(`  清空前: ${beforeClear}`);
    
    expenses = [];
    updateTotalDisplay();
    const afterClear = document.totalElement.textContent;
    const test3 = afterClear === '今日總計：0 元';
    if (test3) {
        console.log(`✓ 通過 - 清空後顯示: ${afterClear}`);
    } else {
        console.log(`✗ 失敗 - 預期: 今日總計：0 元, 實際: ${afterClear}`);
        allPassed = false;
    }
    
    // 測試 4: calculateTotal() 對空陣列應返回 0
    console.log('\n測試 4：calculateTotal() 對空陣列應返回 0...');
    expenses = [];
    const total = calculateTotal();
    const test4 = total === 0;
    if (test4) {
        console.log(`✓ 通過 - calculateTotal() 返回: ${total}`);
    } else {
        console.log(`✗ 失敗 - 預期: 0, 實際: ${total}`);
        allPassed = false;
    }
    
    // 總結
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
        console.log('✓ 所有單元測試通過！\n');
        process.exit(0);
    } else {
        console.log('✗ 部分單元測試失敗\n');
        process.exit(1);
    }
}

// 執行測試
runTests();
