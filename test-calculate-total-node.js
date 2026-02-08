/**
 * Node.js 測試：calculateTotal() 函式
 * 
 * 測試 calculateTotal() 函式的核心邏輯
 * 驗證需求：7.6
 */

// 模擬全域變數和函式
let expenses = [];

/**
 * 計算所有支出記錄的總金額
 * 遍歷 expenses 陣列並計算所有金額的總和
 * @returns {number} 總金額，如果沒有記錄則返回 0
 */
function calculateTotal() {
    return expenses.reduce((total, expense) => {
        return total + expense.amount;
    }, 0);
}

// 測試函式
function runTests() {
    let passed = 0;
    let failed = 0;

    console.log('開始測試 calculateTotal() 函式...\n');

    // 測試 1：空陣列應該返回 0
    console.log('測試 1: 空陣列應該返回 0');
    expenses = [];
    const result1 = calculateTotal();
    if (result1 === 0) {
        console.log('✓ 通過：空陣列返回 0');
        passed++;
    } else {
        console.log(`✗ 失敗：預期 0，實際得到 ${result1}`);
        failed++;
    }

    // 測試 2：單筆記錄應該返回該記錄的金額
    console.log('\n測試 2: 單筆記錄應該返回該記錄的金額');
    expenses = [
        { id: '1', amount: 100, category: '飲食' }
    ];
    const result2 = calculateTotal();
    if (result2 === 100) {
        console.log('✓ 通過：單筆記錄返回正確金額');
        passed++;
    } else {
        console.log(`✗ 失敗：預期 100，實際得到 ${result2}`);
        failed++;
    }

    // 測試 3：多筆記錄應該返回所有金額的總和
    console.log('\n測試 3: 多筆記錄應該返回所有金額的總和');
    expenses = [
        { id: '1', amount: 100, category: '飲食' },
        { id: '2', amount: 50, category: '交通' },
        { id: '3', amount: 200, category: '娛樂' }
    ];
    const result3 = calculateTotal();
    if (result3 === 350) {
        console.log('✓ 通過：多筆記錄返回正確總和 (100 + 50 + 200 = 350)');
        passed++;
    } else {
        console.log(`✗ 失敗：預期 350，實際得到 ${result3}`);
        failed++;
    }

    // 測試 4：不同類別的記錄都應該被計算（驗證需求 7.6）
    console.log('\n測試 4: 不同類別的記錄都應該被計算');
    expenses = [
        { id: '1', amount: 150, category: '飲食' },
        { id: '2', amount: 30, category: '交通' },
        { id: '3', amount: 120, category: '娛樂' },
        { id: '4', amount: 80, category: '飲食' }
    ];
    const result4 = calculateTotal();
    if (result4 === 380) {
        console.log('✓ 通過：所有類別的記錄都被正確計算 (150 + 30 + 120 + 80 = 380)');
        passed++;
    } else {
        console.log(`✗ 失敗：預期 380，實際得到 ${result4}`);
        failed++;
    }

    // 測試 5：小數金額應該被正確計算
    console.log('\n測試 5: 小數金額應該被正確計算');
    expenses = [
        { id: '1', amount: 10.5, category: '飲食' },
        { id: '2', amount: 20.3, category: '交通' },
        { id: '3', amount: 15.2, category: '娛樂' }
    ];
    const result5 = calculateTotal();
    const expected5 = 46.0; // 10.5 + 20.3 + 15.2
    // 使用小數點比較（考慮浮點數精度問題）
    if (Math.abs(result5 - expected5) < 0.01) {
        console.log(`✓ 通過：小數金額正確計算 (10.5 + 20.3 + 15.2 = ${result5})`);
        passed++;
    } else {
        console.log(`✗ 失敗：預期 ${expected5}，實際得到 ${result5}`);
        failed++;
    }

    // 測試 6：大量記錄應該被正確計算
    console.log('\n測試 6: 大量記錄應該被正確計算');
    expenses = [];
    for (let i = 0; i < 100; i++) {
        expenses.push({ id: i.toString(), amount: 10, category: '飲食' });
    }
    const result6 = calculateTotal();
    if (result6 === 1000) {
        console.log('✓ 通過：100 筆記錄正確計算 (100 × 10 = 1000)');
        passed++;
    } else {
        console.log(`✗ 失敗：預期 1000，實際得到 ${result6}`);
        failed++;
    }

    // 輸出測試結果摘要
    console.log('\n' + '='.repeat(50));
    console.log(`測試完成！通過：${passed}，失敗：${failed}`);
    console.log('='.repeat(50));

    // 如果有失敗的測試，返回錯誤碼
    if (failed > 0) {
        process.exit(1);
    }
}

// 執行測試
runTests();
