// Node.js 測試 saveToLocalStorage() 函式
// 模擬 localStorage 和瀏覽器環境

// 模擬 localStorage
class LocalStorageMock {
    constructor() {
        this.store = {};
    }
    
    getItem(key) {
        return this.store[key] || null;
    }
    
    setItem(key, value) {
        this.store[key] = String(value);
    }
    
    clear() {
        this.store = {};
    }
}

// 設定全域變數
global.localStorage = new LocalStorageMock();
global.alert = (msg) => console.log('Alert:', msg);
global.console = console;

// 載入 script.js 的相關函式
let expenses = [];

function saveToLocalStorage() {
    try {
        const jsonString = JSON.stringify(expenses);
        localStorage.setItem('expenses', jsonString);
    } catch (error) {
        console.error('儲存到 localStorage 失敗:', error);
        alert('無法儲存資料，請檢查瀏覽器儲存空間');
    }
}

// 測試輔助函式
let testsPassed = 0;
let testsFailed = 0;

function runTest(testName, testFn) {
    try {
        testFn();
        console.log(`✓ ${testName}`);
        testsPassed++;
        return true;
    } catch (error) {
        console.log(`✗ ${testName}: ${error.message}`);
        testsFailed++;
        return false;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || '斷言失敗');
    }
}

// 清空 localStorage
localStorage.clear();

console.log('開始測試 saveToLocalStorage() 函式\n');

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

// 測試 8：驗證錯誤處理（模擬 localStorage 失敗）
runTest('測試 8：驗證錯誤處理', () => {
    // 暫時替換 localStorage.setItem 使其拋出錯誤
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
        throw new Error('QuotaExceededError');
    };
    
    expenses = [{ id: '1', amount: 100, category: '飲食' }];
    
    // 應該不會拋出錯誤，而是被 catch 捕獲
    try {
        saveToLocalStorage();
        // 恢復原始函式
        localStorage.setItem = originalSetItem;
    } catch (e) {
        localStorage.setItem = originalSetItem;
        throw new Error('錯誤處理失敗：函式應該捕獲錯誤而不是拋出');
    }
});

console.log('\n測試完成！');
console.log(`通過: ${testsPassed}`);
console.log(`失敗: ${testsFailed}`);

if (testsFailed > 0) {
    process.exit(1);
}
