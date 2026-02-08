// 測試 saveToLocalStorage() 函式

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

// 清空 localStorage 以確保測試環境乾淨
localStorage.clear();

// 測試 1：儲存空陣列
runTest('測試 1：儲存空陣列', () => {
    expenses = [];
    saveToLocalStorage();
    const stored = localStorage.getItem('expenses');
    assert(stored === '[]', `預期 '[]'，實際得到 '${stored}'`);
});

// 測試 2：儲存單筆記錄
runTest('測試 2：儲存單筆記錄', () => {
    expenses = [
        { id: '123', amount: 100, category: '飲食' }
    ];
    saveToLocalStorage();
    const stored = localStorage.getItem('expenses');
    const parsed = JSON.parse(stored);
    assert(parsed.length === 1, `預期長度 1，實際得到 ${parsed.length}`);
    assert(parsed[0].id === '123', `預期 id '123'，實際得到 '${parsed[0].id}'`);
    assert(parsed[0].amount === 100, `預期金額 100，實際得到 ${parsed[0].amount}`);
    assert(parsed[0].category === '飲食', `預期類別 '飲食'，實際得到 '${parsed[0].category}'`);
});

// 測試 3：儲存多筆記錄
runTest('測試 3：儲存多筆記錄', () => {
    expenses = [
        { id: '1', amount: 50, category: '交通' },
        { id: '2', amount: 150, category: '飲食' },
        { id: '3', amount: 200, category: '娛樂' }
    ];
    saveToLocalStorage();
    const stored = localStorage.getItem('expenses');
    const parsed = JSON.parse(stored);
    assert(parsed.length === 3, `預期長度 3，實際得到 ${parsed.length}`);
    assert(parsed[0].amount === 50, `預期第一筆金額 50，實際得到 ${parsed[0].amount}`);
    assert(parsed[1].amount === 150, `預期第二筆金額 150，實際得到 ${parsed[1].amount}`);
    assert(parsed[2].amount === 200, `預期第三筆金額 200，實際得到 ${parsed[2].amount}`);
});

// 測試 4：覆寫現有資料
runTest('測試 4：覆寫現有資料', () => {
    expenses = [{ id: '1', amount: 100, category: '飲食' }];
    saveToLocalStorage();
    
    expenses = [{ id: '2', amount: 200, category: '交通' }];
    saveToLocalStorage();
    
    const stored = localStorage.getItem('expenses');
    const parsed = JSON.parse(stored);
    assert(parsed.length === 1, `預期長度 1，實際得到 ${parsed.length}`);
    assert(parsed[0].id === '2', `預期 id '2'，實際得到 '${parsed[0].id}'`);
    assert(parsed[0].amount === 200, `預期金額 200，實際得到 ${parsed[0].amount}`);
});

// 測試 5：驗證 JSON 格式正確性
runTest('測試 5：驗證 JSON 格式正確性', () => {
    expenses = [
        { id: '123', amount: 99.99, category: '飲食' }
    ];
    saveToLocalStorage();
    const stored = localStorage.getItem('expenses');
    
    // 確保可以正確解析 JSON
    let parsed;
    try {
        parsed = JSON.parse(stored);
    } catch (e) {
        throw new Error('JSON 解析失敗');
    }
    
    // 驗證資料結構
    assert(Array.isArray(parsed), '儲存的資料應該是陣列');
    assert(parsed[0].hasOwnProperty('id'), '記錄應該包含 id 屬性');
    assert(parsed[0].hasOwnProperty('amount'), '記錄應該包含 amount 屬性');
    assert(parsed[0].hasOwnProperty('category'), '記錄應該包含 category 屬性');
});

// 測試 6：驗證保留數字精度
runTest('測試 6：驗證保留數字精度', () => {
    expenses = [
        { id: '1', amount: 123.45, category: '飲食' }
    ];
    saveToLocalStorage();
    const stored = localStorage.getItem('expenses');
    const parsed = JSON.parse(stored);
    assert(parsed[0].amount === 123.45, `預期金額 123.45，實際得到 ${parsed[0].amount}`);
});

// 測試 7：驗證保留中文字元
runTest('測試 7：驗證保留中文字元', () => {
    expenses = [
        { id: '1', amount: 100, category: '飲食' },
        { id: '2', amount: 50, category: '交通' },
        { id: '3', amount: 200, category: '娛樂' }
    ];
    saveToLocalStorage();
    const stored = localStorage.getItem('expenses');
    const parsed = JSON.parse(stored);
    assert(parsed[0].category === '飲食', `預期類別 '飲食'，實際得到 '${parsed[0].category}'`);
    assert(parsed[1].category === '交通', `預期類別 '交通'，實際得到 '${parsed[1].category}'`);
    assert(parsed[2].category === '娛樂', `預期類別 '娛樂'，實際得到 '${parsed[2].category}'`);
});

resultsDiv.innerHTML += '<h2>所有測試完成！</h2>';
