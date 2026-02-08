/**
 * 執行所有測試
 * 最終檢查點：確保所有測試通過
 */

const { execSync } = require('child_process');

const tests = [
    // 單元測試
    { name: 'DOM 元素測試', file: 'test-dom.js' },
    { name: '空清單顯示零元測試', file: 'test-empty-list-zero.js' },
    
    // 屬性測試
    { name: 'localStorage 往返一致性 (PBT)', file: 'test-localstorage-roundtrip-pbt.js' },
    { name: '今日總計計算正確性 (PBT)', file: 'test-total-calculation-pbt.js' },
    { name: '新增有效記錄增加清單長度 (PBT)', file: 'test-add-valid-expense-pbt.js' },
    { name: '成功新增後清空輸入 (PBT)', file: 'test-clear-input-after-add-pbt.js' },
    { name: '新增操作立即持久化 (PBT)', file: 'test-add-persistence-pbt.js' },
    { name: '顯示格式正確性 (PBT)', file: 'test-display-format-pbt.js' },
    { name: '每筆記錄都有刪除按鈕 (PBT)', file: 'test-delete-button-pbt.js' },
    { name: '刪除操作同步更新 (PBT)', file: 'test-delete-sync-pbt.js' },
    { name: '刪除後總計即時更新 (PBT)', file: 'test-delete-update-total-pbt.js' },
    { name: '頁面載入時正確顯示資料 (PBT)', file: 'test-page-load-pbt.js' },
    
    // 整合測試
    { name: '完整的新增流程', file: 'test-integration-add-flow.js' },
    { name: '完整的刪除流程', file: 'test-integration-delete-flow.js' },
    { name: '頁面重新載入', file: 'test-integration-page-reload.js' },
    { name: '響應式設計', file: 'test-integration-responsive.js' },
    { name: '錯誤處理', file: 'test-integration-error-handling.js' }
];

console.log('='.repeat(60));
console.log('執行所有測試 - 最終檢查點');
console.log('='.repeat(60));
console.log();

let passCount = 0;
let failCount = 0;
const failedTests = [];

for (const test of tests) {
    try {
        console.log(`執行: ${test.name}...`);
        
        // 執行測試，捕獲輸出但不顯示
        execSync(`node ${test.file}`, { 
            stdio: 'pipe',
            encoding: 'utf8'
        });
        
        console.log(`✓ 通過: ${test.name}`);
        passCount++;
    } catch (error) {
        console.log(`✗ 失敗: ${test.name}`);
        failCount++;
        failedTests.push({
            name: test.name,
            file: test.file,
            error: error.message
        });
    }
    console.log();
}

console.log('='.repeat(60));
console.log('測試總結');
console.log('='.repeat(60));
console.log(`總測試數: ${tests.length}`);
console.log(`通過: ${passCount}`);
console.log(`失敗: ${failCount}`);
console.log();

if (failCount > 0) {
    console.log('失敗的測試:');
    failedTests.forEach(test => {
        console.log(`  - ${test.name} (${test.file})`);
    });
    console.log();
    console.log('✗ 部分測試失敗，請檢查上述輸出');
    process.exit(1);
} else {
    console.log('✓ 所有測試通過！');
    console.log();
    console.log('個人記帳本應用程式已完成並通過所有測試。');
    console.log('您可以在瀏覽器中打開 index.html 來使用應用程式。');
    process.exit(0);
}
