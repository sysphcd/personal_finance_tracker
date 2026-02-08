// Node.js 測試腳本

// 模擬 createExpense 函式（從 script.js 複製）
function createExpense(amount, category) {
    return {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        category: category
    };
}

// 初始化全域變數
let expenses = [];

// 執行測試
console.log('=== 測試支出記錄資料結構 ===\n');

let testsPassed = 0;
let totalTests = 0;

// 測試 1：建立基本支出記錄
totalTests++;
console.log('測試 1 - 建立飲食記錄');
const expense1 = createExpense(150, '飲食');
console.log('  結果:', expense1);

if (!expense1.id || !expense1.amount || !expense1.category) {
    console.error('  ❌ 失敗：支出記錄缺少必要欄位');
} else if (typeof expense1.id !== 'string' || typeof expense1.amount !== 'number' || typeof expense1.category !== 'string') {
    console.error('  ❌ 失敗：資料型別不正確');
} else if (expense1.amount !== 150 || expense1.category !== '飲食') {
    console.error('  ❌ 失敗：資料值不正確');
} else {
    console.log('  ✅ 通過');
    testsPassed++;
}

// 測試 2：建立不同類別的記錄
totalTests++;
console.log('\n測試 2 - 建立交通記錄');
const expense2 = createExpense(50, '交通');
console.log('  結果:', expense2);

if (expense2.amount !== 50 || expense2.category !== '交通') {
    console.error('  ❌ 失敗：交通記錄資料不正確');
} else {
    console.log('  ✅ 通過');
    testsPassed++;
}

// 測試 3：建立娛樂類別記錄
totalTests++;
console.log('\n測試 3 - 建立娛樂記錄');
const expense3 = createExpense(200, '娛樂');
console.log('  結果:', expense3);

if (expense3.amount !== 200 || expense3.category !== '娛樂') {
    console.error('  ❌ 失敗：娛樂記錄資料不正確');
} else {
    console.log('  ✅ 通過');
    testsPassed++;
}

// 測試 4：測試字串數字轉換
totalTests++;
console.log('\n測試 4 - 字串數字轉換');
const expense4 = createExpense('99.5', '飲食');
console.log('  結果:', expense4);

if (expense4.amount !== 99.5) {
    console.error('  ❌ 失敗：字串數字轉換不正確');
} else {
    console.log('  ✅ 通過');
    testsPassed++;
}

// 測試 5：測試全域 expenses 陣列
totalTests++;
console.log('\n測試 5 - 全域 expenses 陣列');

if (!Array.isArray(expenses)) {
    console.error('  ❌ 失敗：expenses 不是陣列');
} else {
    expenses.push(expense1);
    if (expenses.length !== 1 || expenses[0].amount !== 150) {
        console.error('  ❌ 失敗：無法正確新增記錄到陣列');
    } else {
        console.log('  ✅ 通過');
        testsPassed++;
    }
}

// 測試 6：測試需求 5.5 - JSON 序列化
totalTests++;
console.log('\n測試 6 - 需求 5.5：資料格式保留金額和類別資訊');

const testExpense = createExpense(250, '交通');
const serialized = JSON.stringify(testExpense);
const deserialized = JSON.parse(serialized);

console.log('  原始:', testExpense);
console.log('  序列化:', serialized);
console.log('  反序列化:', deserialized);

if (deserialized.id !== testExpense.id || 
    deserialized.amount !== testExpense.amount || 
    deserialized.category !== testExpense.category) {
    console.error('  ❌ 失敗：序列化後資料不一致');
} else {
    console.log('  ✅ 通過');
    testsPassed++;
}

// 總結
console.log('\n' + '='.repeat(50));
console.log(`測試結果：${testsPassed}/${totalTests} 通過`);
if (testsPassed === totalTests) {
    console.log('✅ 所有測試通過！');
} else {
    console.log('❌ 部分測試失敗');
    process.exit(1);
}
console.log('='.repeat(50));
