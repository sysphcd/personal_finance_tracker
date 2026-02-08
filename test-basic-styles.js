// 基本樣式單元測試 - Task 2.1
// 需求：3.1 - 淺灰色背景、容器置中和適當的寬度、字體和顏色設定

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

console.log('開始執行基本樣式測試 (Task 2.1)...\n');

// 測試 1: 檢查 body 背景色為淺灰色 (#f5f5f5)
const bodyBgColorMatch = cssContent.match(/body\s*{[^}]*background-color:\s*#f5f5f5/s);
assert(
    bodyBgColorMatch !== null,
    '頁面背景色設定為淺灰色 (#f5f5f5)',
    bodyBgColorMatch ? '' : '未找到 body { background-color: #f5f5f5 }'
);

// 測試 2: 檢查容器存在
const containerMatch = cssContent.match(/\.container\s*{/);
assert(
    containerMatch !== null,
    '主容器 (.container) 樣式已定義'
);

// 測試 3: 檢查容器最大寬度設定
const maxWidthMatch = cssContent.match(/\.container\s*{[^}]*max-width:\s*\d+px/s);
assert(
    maxWidthMatch !== null,
    '容器設定了適當的最大寬度 (max-width)',
    maxWidthMatch ? '' : '未找到 .container { max-width: XXXpx }'
);

// 測試 4: 檢查容器水平置中 (margin: auto)
const marginAutoMatch = cssContent.match(/\.container\s*{[^}]*margin:\s*\d+px\s+auto/s);
assert(
    marginAutoMatch !== null,
    '容器水平置中 (margin: XXpx auto)',
    marginAutoMatch ? '' : '未找到 .container { margin: XXpx auto }'
);

// 測試 5: 檢查 body 字體設定
const fontFamilyMatch = cssContent.match(/body\s*{[^}]*font-family:\s*[^;]+;/s);
assert(
    fontFamilyMatch !== null,
    '頁面設定了字體 (font-family)',
    fontFamilyMatch ? '' : '未找到 body { font-family: ... }'
);

// 測試 6: 檢查 body 文字顏色設定為深灰色 (#333)
const colorMatch = cssContent.match(/body\s*{[^}]*color:\s*#333/s);
assert(
    colorMatch !== null,
    '頁面文字顏色設定為深灰色 (#333)',
    colorMatch ? '' : '未找到 body { color: #333 }'
);

// 測試 7: 檢查容器有內邊距 (padding)
const paddingMatch = cssContent.match(/\.container\s*{[^}]*padding:\s*\d+px/s);
assert(
    paddingMatch !== null,
    '容器設定了適當的內邊距 (padding)',
    paddingMatch ? '' : '未找到 .container { padding: XXpx }'
);

// 顯示測試摘要
console.log(`\n測試完成：共 ${passCount + failCount} 個測試，${passCount} 個通過，${failCount} 個失敗`);

// 返回退出碼
process.exit(failCount === 0 ? 0 : 1);
