/**
 * 瀏覽器測試：calculateTotal() 函式
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

// 測試結果顯示函式
function displayResult(testName, passed, message) {
    const resultsDiv = document.getElementById('results');
    const resultDiv = document.createElement('div');
    resultDiv.className = `test-result ${passed ? 'pass' : 'fail'}`;
    resultDiv.textContent = `${passed ? '✓' : '✗'} ${testName}: ${message}`;
    resultsDiv.appendChild(resultDiv);
}

// 測試函式
function runTests() {
    let passed = 0;
    let failed = 0;

    // 測試 1：空陣列應該返回 0
    expenses = [];
    const result1 = calculateTotal();
    if (result1 === 0) {
        displayResult('測試 1', true, '空陣列返回 0');
        passed++;
    } else {
        displayResult('測試 1', false, `預期 0，實際得到 ${result1}`);
        failed++;
    }

    // 測試 2：單筆記錄應該返回該記錄的金額
    expenses = [
        { id: '1', amount: 100, category: '飲食' }
    ];
    const result2 = calculateTotal();
    if (result2 === 100) {
        displayResult('測試 2', true, '單筆記錄返回正確金額 (100)');
        passed++;
    } else {
        displayResult('測試 2', false, `預期 100，實際得到 ${result2}`);
        failed++;
    }

    // 測試 3：多筆記錄應該返回所有金額的總和
    expenses = [
        { id: '1', amount: 100, category: '飲食' },
        { id: '2', amount: 50, category: '交通' },
        { id: '3', amount: 200, category: '娛樂' }
    ];
    const result3 = calculateTotal();
    if (result3 === 350) {
        displayResult('測試 3', true, '多筆記錄返回正確總和 (100 + 50 + 200 = 350)');
        passed++;
    } else {
        displayResult('測試 3', false, `預期 350，實際得到 ${result3}`);
        failed++;
    }

    // 測試 4：不同類別的記錄都應該被計算（驗證需求 7.6）
    expenses = [
        { id: '1', amount: 150, category: '飲食' },
        { id: '2', amount: 30, category: '交通' },
        { id: '3', amount: 120, category: '娛樂' },
        { id: '4', amount: 80, category: '飲食' }
    ];
    const result4 = calculateTotal();
    if (result4 === 380) {
        displayResult('測試 4', true, '所有類別的記錄都被正確計算 (150 + 30 + 120 + 80 = 380)');
        passed++;
    } else {
        displayResult('測試 4', false, `預期 380，實際得到 ${result4}`);
        failed++;
    }

    // 測試 5：小數金額應該被正確計算
    expenses = [
        { id: '1', amount: 10.5, category: '飲食' },
        { id: '2', amount: 20.3, category: '交通' },
        { id: '3', amount: 15.2, category: '娛樂' }
    ];
    const result5 = calculateTotal();
    const expected5 = 46.0; // 10.5 + 20.3 + 15.2
    if (Math.abs(result5 - expected5) < 0.01) {
        displayResult('測試 5', true, `小數金額正確計算 (10.5 + 20.3 + 15.2 = ${result5})`);
        passed++;
    } else {
        displayResult('測試 5', false, `預期 ${expected5}，實際得到 ${result5}`);
        failed++;
    }

    // 測試 6：大量記錄應該被正確計算
    expenses = [];
    for (let i = 0; i < 100; i++) {
        expenses.push({ id: i.toString(), amount: 10, category: '飲食' });
    }
    const result6 = calculateTotal();
    if (result6 === 1000) {
        displayResult('測試 6', true, '100 筆記錄正確計算 (100 × 10 = 1000)');
        passed++;
    } else {
        displayResult('測試 6', false, `預期 1000，實際得到 ${result6}`);
        failed++;
    }

    // 顯示測試摘要
    const summaryDiv = document.getElementById('summary');
    summaryDiv.textContent = `測試完成！通過：${passed}，失敗：${failed}`;
    summaryDiv.style.color = failed === 0 ? '#155724' : '#721c24';
}

// 當頁面載入完成後執行測試
document.addEventListener('DOMContentLoaded', runTests);
