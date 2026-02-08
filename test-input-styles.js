// 輸入區域樣式單元測試 - Task 2.2
// 需求：3.2, 3.3, 3.4 - 輸入欄位和下拉選單的樣式、綠色新增按鈕、圓角和間距

const fs = require('fs');
const path = require('path');

// 讀取 CSS 檔案
const cssPath = path.join(__dirname, 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// 測試結果
let passCount = 0;
let failCount = 0;

// 測試輔助函式
function assert(condition, testName, details = '') {
    if (condition) {
        console.log(`✓ PASS: ${testName}`);
        passCount++;
    } else {
        console.log(`✗ FAIL: ${testName}${details ? ' - ' + details : ''}`);
        failCount++;
    }
}

console.log('開始執行輸入區域樣式測試 (Task 2.2)...\n');
console.log('需求：3.2 - 綠色新增按鈕');
console.log('需求：3.3 - 圓角');
console.log('需求：3.4 - 適當間距\n');

// 測試 1: 檢查輸入區域容器樣式已定義
const inputSectionMatch = cssContent.match(/\.input-section\s*{/);
assert(
    inputSectionMatch !== null,
    '輸入區域容器 (.input-section) 樣式已定義'
);

// 測試 2: 檢查金額輸入欄位樣式
const amountInputMatch = cssContent.match(/#amountInput\s*{/);
assert(
    amountInputMatch !== null,
    '金額輸入欄位 (#amountInput) 樣式已定義'
);

// 測試 2.1: 檢查輸入欄位有內邊距
const inputPaddingMatch = cssContent.match(/#amountInput\s*{[^}]*padding:\s*\d+px/s);
assert(
    inputPaddingMatch !== null,
    '金額輸入欄位有內邊距 (padding)',
    inputPaddingMatch ? '' : '未找到 #amountInput { padding: XXpx }'
);

// 測試 2.2: 檢查輸入欄位有邊框
const inputBorderMatch = cssContent.match(/#amountInput\s*{[^}]*border:\s*[^;]+;/s);
assert(
    inputBorderMatch !== null,
    '金額輸入欄位有邊框 (border)',
    inputBorderMatch ? '' : '未找到 #amountInput { border: ... }'
);

// 測試 2.3: 檢查輸入欄位有圓角 (需求 3.3)
const inputBorderRadiusMatch = cssContent.match(/#amountInput\s*{[^}]*border-radius:\s*\d+px/s);
assert(
    inputBorderRadiusMatch !== null,
    '金額輸入欄位有圓角 (border-radius) - 需求 3.3',
    inputBorderRadiusMatch ? '' : '未找到 #amountInput { border-radius: XXpx }'
);

// 測試 3: 檢查類別下拉選單樣式
const categorySelectMatch = cssContent.match(/#categorySelect\s*{/);
assert(
    categorySelectMatch !== null,
    '類別下拉選單 (#categorySelect) 樣式已定義'
);

// 測試 3.1: 檢查下拉選單有內邊距
const selectPaddingMatch = cssContent.match(/#categorySelect\s*{[^}]*padding:\s*\d+px/s);
assert(
    selectPaddingMatch !== null,
    '類別下拉選單有內邊距 (padding)',
    selectPaddingMatch ? '' : '未找到 #categorySelect { padding: XXpx }'
);

// 測試 3.2: 檢查下拉選單有邊框
const selectBorderMatch = cssContent.match(/#categorySelect\s*{[^}]*border:\s*[^;]+;/s);
assert(
    selectBorderMatch !== null,
    '類別下拉選單有邊框 (border)',
    selectBorderMatch ? '' : '未找到 #categorySelect { border: ... }'
);

// 測試 3.3: 檢查下拉選單有圓角 (需求 3.3)
const selectBorderRadiusMatch = cssContent.match(/#categorySelect\s*{[^}]*border-radius:\s*\d+px/s);
assert(
    selectBorderRadiusMatch !== null,
    '類別下拉選單有圓角 (border-radius) - 需求 3.3',
    selectBorderRadiusMatch ? '' : '未找到 #categorySelect { border-radius: XXpx }'
);

// 測試 4: 檢查新增按鈕樣式
const addBtnMatch = cssContent.match(/#addBtn\s*{/);
assert(
    addBtnMatch !== null,
    '新增按鈕 (#addBtn) 樣式已定義'
);

// 測試 4.1: 檢查按鈕背景色為綠色 (需求 3.2)
const btnBgColorMatch = cssContent.match(/#addBtn\s*{[^}]*background-color:\s*#4CAF50/si);
assert(
    btnBgColorMatch !== null,
    '新增按鈕背景色為綠色 (#4CAF50) - 需求 3.2',
    btnBgColorMatch ? '' : '未找到 #addBtn { background-color: #4CAF50 }'
);

// 測試 4.2: 檢查按鈕文字顏色為白色
const btnColorMatch = cssContent.match(/#addBtn\s*{[^}]*color:\s*white/si);
assert(
    btnColorMatch !== null,
    '新增按鈕文字顏色為白色',
    btnColorMatch ? '' : '未找到 #addBtn { color: white }'
);

// 測試 4.3: 檢查按鈕有圓角 (需求 3.3)
const btnBorderRadiusMatch = cssContent.match(/#addBtn\s*{[^}]*border-radius:\s*\d+px/s);
assert(
    btnBorderRadiusMatch !== null,
    '新增按鈕有圓角 (border-radius) - 需求 3.3',
    btnBorderRadiusMatch ? '' : '未找到 #addBtn { border-radius: XXpx }'
);

// 測試 4.4: 檢查按鈕有內邊距
const btnPaddingMatch = cssContent.match(/#addBtn\s*{[^}]*padding:\s*\d+px/s);
assert(
    btnPaddingMatch !== null,
    '新增按鈕有內邊距 (padding)',
    btnPaddingMatch ? '' : '未找到 #addBtn { padding: XXpx }'
);

// 測試 4.5: 檢查按鈕有游標指標
const btnCursorMatch = cssContent.match(/#addBtn\s*{[^}]*cursor:\s*pointer/s);
assert(
    btnCursorMatch !== null,
    '新增按鈕有游標指標 (cursor: pointer)',
    btnCursorMatch ? '' : '未找到 #addBtn { cursor: pointer }'
);

// 測試 5: 檢查輸入區域元素之間的間距 (需求 3.4)
// 檢查是否使用 flexbox 或 grid 佈局
const flexMatch = cssContent.match(/\.input-section\s*{[^}]*display:\s*flex/s);
const gridMatch = cssContent.match(/\.input-section\s*{[^}]*display:\s*grid/s);
const hasFlexOrGrid = flexMatch !== null || gridMatch !== null;

assert(
    hasFlexOrGrid,
    '輸入區域使用 flexbox 或 grid 佈局'
);

if (hasFlexOrGrid) {
    // 檢查 gap 屬性
    const gapMatch = cssContent.match(/\.input-section\s*{[^}]*gap:\s*\d+px/s);
    assert(
        gapMatch !== null,
        '輸入區域元素之間有間距 (gap) - 需求 3.4',
        gapMatch ? '' : '未找到 .input-section { gap: XXpx }'
    );
}

// 測試 5.2: 檢查輸入區域本身有下邊距
const sectionMarginMatch = cssContent.match(/\.input-section\s*{[^}]*margin-bottom:\s*\d+px/s);
assert(
    sectionMarginMatch !== null,
    '輸入區域有下邊距 (margin-bottom) - 需求 3.4',
    sectionMarginMatch ? '' : '未找到 .input-section { margin-bottom: XXpx }'
);

// 顯示測試摘要
console.log(`\n${'='.repeat(60)}`);
console.log(`測試完成：共 ${passCount + failCount} 個測試，${passCount} 個通過，${failCount} 個失敗`);
console.log(`${'='.repeat(60)}`);

if (failCount === 0) {
    console.log('\n✓ 所有測試通過！Task 2.2 完成。');
    console.log('\n驗證的需求：');
    console.log('  - 需求 3.2: 綠色新增按鈕 ✓');
    console.log('  - 需求 3.3: 圓角 ✓');
    console.log('  - 需求 3.4: 適當間距 ✓');
}

// 返回退出碼
process.exit(failCount === 0 ? 0 : 1);
