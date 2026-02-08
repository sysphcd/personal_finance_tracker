// 測試 loadFromLocalStorage() 函式

// 測試結果容器
const resultsDiv = document.getElementById('test-results');

// 測試輔助函式
function runTest(testName, testFn) {
    try {
        testFn();
        resultsDiv.innerHTML += `<p style="color: green;">✓ ${testName}</p>`;
        return true;
    } catch (error) {
        resultsDiv.innerHTML += `<p style="color: red;">✗ ${testName}: ${error.message}</p>`;
        return false;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || '斷言失敗');
    }
}

// 測試 1：載入空 localStorage（第一次使用）
runTest('測試 1：載入空 localStorage（第一次使用）', () => {
    localStorage.clear();
    const result = loadFromLocalStorage();
    assert(Array.isArray(result), '應該返回陣列');
    assert(result.length === 0, `預期空陣列，實際長度 ${result.length}`);
});

// 測試 2：載入單筆記錄
runTest('測試 2：載入單筆記錄', () => {
    localStorage.clear();
    const testData = [
        { id: '123', amount: 100, category: '飲食' }
    ];
    localStorage.setItem('expenses', JSON.stringify(testData));
    
    const result = loadFromLocalStorage();
    assert(Array.isArray(result), '應該返回陣列');
    assert(result.length === 1, `預期長度 1，實際得到 ${result.length}`);
    assert(result[0].id === '123', `預期 id '123'，實際得到 '${result[0].id}'`);
    assert(result[0].amount === 100, `預期金額 100，實際得到 ${result[0].amount}`);
    assert(result[0].category === '飲食', `預期類別 '飲食'，實際得到 '${result[0].category}'`);
});

// 測試 3：載入多筆記錄
runTest('測試 3：載入多筆記錄', () => {
    localStorage.clear();
    const testData = [
        { id: '1', amount: 50, category: '交通' },
        { id: '2', amount: 150, category: '飲食' },
        { id: '3', amount: 200, category: '娛樂' }
    ];
    localStorage.setItem('expenses', JSON.stringify(testData));
    
    const result = loadFromLocalStorage();
    assert(result.length === 3, `預期長度 3，實際得到 ${result.length}`);
    assert(result[0].amount === 50, `預期第一筆金額 50，實際得到 ${result[0].amount}`);
    assert(result[1].amount === 150, `預期第二筆金額 150，實際得到 ${result[1].amount}`);
    assert(result[2].amount === 200, `預期第三筆金額 200，實際得到 ${result[2].amount}`);
});

// 測試 4：處理空字串
runTest('測試 4：處理空字串', () => {
    localStorage.clear();
    localStorage.setItem('expenses', '');
    
    const result = loadFromLocalStorage();
    assert(Array.isArray(result), '應該返回陣列');
    assert(result.length === 0, `預期空陣列，實際長度 ${result.length}`);
});

// 測試 5：處理無效的 JSON（解析錯誤）
runTest('測試 5：處理無效的 JSON（解析錯誤）', () => {
    localStorage.clear();
    localStorage.setItem('expenses', 'invalid json {]');
    
    const result = loadFromLocalStorage();
    assert(Array.isArray(result), '應該返回空陣列而不是拋出錯誤');
    assert(result.length === 0, `預期空陣列，實際長度 ${result.length}`);
    
    // 驗證損壞的資料已被清除
    const stored = localStorage.getItem('expenses');
    assert(stored === null, '損壞的資料應該被清除');
});

// 測試 6：處理非陣列資料
runTest('測試 6：處理非陣列資料', () => {
    localStorage.clear();
    localStorage.setItem('expenses', '{"id": "123", "amount": 100}');
    
    const result = loadFromLocalStorage();
    assert(Array.isArray(result), '應該返回陣列');
    assert(result.length === 0, `預期空陣列，實際長度 ${result.length}`);
});

// 測試 7：保留數字精度
runTest('測試 7：保留數字精度', () => {
    localStorage.clear();
    const testData = [
        { id: '1', amount: 123.45, category: '飲食' }
    ];
    localStorage.setItem('expenses', JSON.stringify(testData));
    
    const result = loadFromLocalStorage();
    assert(result[0].amount === 123.45, `預期金額 123.45，實際得到 ${result[0].amount}`);
});

// 測試 8：保留中文字元
runTest('測試 8：保留中文字元', () => {
    localStorage.clear();
    const testData = [
        { id: '1', amount: 100, category: '飲食' },
        { id: '2', amount: 50, category: '交通' },
        { id: '3', amount: 200, category: '娛樂' }
    ];
    localStorage.setItem('expenses', JSON.stringify(testData));
    
    const result = loadFromLocalStorage();
    assert(result[0].category === '飲食', `預期類別 '飲食'，實際得到 '${result[0].category}'`);
    assert(result[1].category === '交通', `預期類別 '交通'，實際得到 '${result[1].category}'`);
    assert(result[2].category === '娛樂', `預期類別 '娛樂'，實際得到 '${result[2].category}'`);
});

// 測試 9：往返一致性（儲存後載入）
runTest('測試 9：往返一致性（儲存後載入）', () => {
    localStorage.clear();
    const originalData = [
        { id: '1', amount: 50.5, category: '交通' },
        { id: '2', amount: 150.75, category: '飲食' }
    ];
    
    // 儲存
    expenses = originalData;
    saveToLocalStorage();
    
    // 載入
    const loadedData = loadFromLocalStorage();
    
    // 驗證一致性
    assert(loadedData.length === originalData.length, '長度應該相同');
    assert(loadedData[0].id === originalData[0].id, 'id 應該相同');
    assert(loadedData[0].amount === originalData[0].amount, 'amount 應該相同');
    assert(loadedData[0].category === originalData[0].category, 'category 應該相同');
    assert(loadedData[1].id === originalData[1].id, '第二筆 id 應該相同');
    assert(loadedData[1].amount === originalData[1].amount, '第二筆 amount 應該相同');
    assert(loadedData[1].category === originalData[1].category, '第二筆 category 應該相同');
});

// 測試 10：驗證 init() 函式正確載入資料
runTest('測試 10：驗證 init() 函式正確載入資料', () => {
    localStorage.clear();
    const testData = [
        { id: '1', amount: 100, category: '飲食' },
        { id: '2', amount: 50, category: '交通' }
    ];
    localStorage.setItem('expenses', JSON.stringify(testData));
    
    // 重置 expenses 陣列
    expenses = [];
    
    // 呼叫 init()
    init();
    
    // 驗證 expenses 陣列已被載入
    assert(expenses.length === 2, `預期長度 2，實際得到 ${expenses.length}`);
    assert(expenses[0].amount === 100, `預期第一筆金額 100，實際得到 ${expenses[0].amount}`);
    assert(expenses[1].amount === 50, `預期第二筆金額 50，實際得到 ${expenses[1].amount}`);
});

resultsDiv.innerHTML += '<h2>所有測試完成！</h2>';
