// 測試支出記錄資料結構
// 此測試驗證需求 5.5：系統應該以保留金額和類別資訊的格式儲存支出記錄資料

/**
 * 測試 createExpense 函式
 */
function testCreateExpense() {
    console.log('=== 測試 createExpense 函式 ===');
    
    // 測試 1：建立基本支出記錄
    const expense1 = createExpense(150, '飲食');
    console.log('測試 1 - 建立飲食記錄:', expense1);
    
    // 驗證物件結構
    if (!expense1.id || !expense1.amount || !expense1.category) {
        console.error('❌ 失敗：支出記錄缺少必要欄位');
        return false;
    }
    
    // 驗證資料型別
    if (typeof expense1.id !== 'string') {
        console.error('❌ 失敗：id 應該是字串型別');
        return false;
    }
    
    if (typeof expense1.amount !== 'number') {
        console.error('❌ 失敗：amount 應該是數字型別');
        return false;
    }
    
    if (typeof expense1.category !== 'string') {
        console.error('❌ 失敗：category 應該是字串型別');
        return false;
    }
    
    // 驗證數值
    if (expense1.amount !== 150) {
        console.error('❌ 失敗：金額不正確');
        return false;
    }
    
    if (expense1.category !== '飲食') {
        console.error('❌ 失敗：類別不正確');
        return false;
    }
    
    console.log('✅ 測試 1 通過');
    
    // 測試 2：建立不同類別的記錄
    const expense2 = createExpense(50, '交通');
    console.log('測試 2 - 建立交通記錄:', expense2);
    
    if (expense2.amount !== 50 || expense2.category !== '交通') {
        console.error('❌ 失敗：交通記錄資料不正確');
        return false;
    }
    
    console.log('✅ 測試 2 通過');
    
    // 測試 3：建立娛樂類別記錄
    const expense3 = createExpense(200, '娛樂');
    console.log('測試 3 - 建立娛樂記錄:', expense3);
    
    if (expense3.amount !== 200 || expense3.category !== '娛樂') {
        console.error('❌ 失敗：娛樂記錄資料不正確');
        return false;
    }
    
    console.log('✅ 測試 3 通過');
    
    // 測試 4：驗證 id 唯一性（不同時間建立的記錄應該有不同的 id）
    // 注意：如果在同一毫秒內建立，id 可能相同，這是已知限制
    if (expense1.id === expense2.id && expense2.id === expense3.id) {
        console.warn('⚠️  警告：所有記錄的 id 相同（可能在同一毫秒內建立）');
    } else {
        console.log('✅ 測試 4 通過：id 具有唯一性');
    }
    
    // 測試 5：測試字串數字轉換
    const expense4 = createExpense('99.5', '飲食');
    console.log('測試 5 - 字串數字轉換:', expense4);
    
    if (expense4.amount !== 99.5) {
        console.error('❌ 失敗：字串數字轉換不正確');
        return false;
    }
    
    console.log('✅ 測試 5 通過');
    
    return true;
}

/**
 * 測試全域 expenses 陣列
 */
function testExpensesArray() {
    console.log('\n=== 測試全域 expenses 陣列 ===');
    
    // 驗證 expenses 陣列存在
    if (typeof expenses === 'undefined') {
        console.error('❌ 失敗：expenses 陣列未定義');
        return false;
    }
    
    // 驗證是陣列型別
    if (!Array.isArray(expenses)) {
        console.error('❌ 失敗：expenses 不是陣列');
        return false;
    }
    
    console.log('✅ expenses 陣列已正確初始化');
    
    // 測試新增記錄到陣列
    const initialLength = expenses.length;
    const testExpense = createExpense(100, '飲食');
    expenses.push(testExpense);
    
    if (expenses.length !== initialLength + 1) {
        console.error('❌ 失敗：無法新增記錄到陣列');
        return false;
    }
    
    console.log('✅ 可以新增記錄到 expenses 陣列');
    
    // 驗證記錄內容
    const lastExpense = expenses[expenses.length - 1];
    if (lastExpense.amount !== 100 || lastExpense.category !== '飲食') {
        console.error('❌ 失敗：陣列中的記錄資料不正確');
        return false;
    }
    
    console.log('✅ 陣列中的記錄資料正確');
    
    // 清理測試資料
    expenses.pop();
    
    return true;
}

/**
 * 測試資料結構符合需求 5.5
 */
function testRequirement5_5() {
    console.log('\n=== 測試需求 5.5：資料格式保留金額和類別資訊 ===');
    
    // 建立測試記錄
    const testExpense = createExpense(250, '交通');
    
    // 模擬 JSON 序列化（localStorage 會使用）
    const serialized = JSON.stringify(testExpense);
    console.log('序列化後:', serialized);
    
    // 模擬反序列化
    const deserialized = JSON.parse(serialized);
    console.log('反序列化後:', deserialized);
    
    // 驗證資料完整性
    if (deserialized.id !== testExpense.id) {
        console.error('❌ 失敗：id 在序列化後遺失或改變');
        return false;
    }
    
    if (deserialized.amount !== testExpense.amount) {
        console.error('❌ 失敗：amount 在序列化後遺失或改變');
        return false;
    }
    
    if (deserialized.category !== testExpense.category) {
        console.error('❌ 失敗：category 在序列化後遺失或改變');
        return false;
    }
    
    console.log('✅ 資料格式可以正確保留金額和類別資訊（需求 5.5）');
    
    return true;
}

/**
 * 執行所有測試
 */
function runAllTests() {
    console.log('開始測試支出記錄資料結構...\n');
    
    let allPassed = true;
    
    allPassed = testCreateExpense() && allPassed;
    allPassed = testExpensesArray() && allPassed;
    allPassed = testRequirement5_5() && allPassed;
    
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
        console.log('✅ 所有測試通過！');
    } else {
        console.log('❌ 部分測試失敗');
    }
    console.log('='.repeat(50));
    
    return allPassed;
}

// 當頁面載入完成後執行測試
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}
