#!/usr/bin/env node

/**
 * 結構驗證腳本
 * 驗證 index.html 是否包含所有必要的元素和屬性
 */

const fs = require('fs');
const path = require('path');

// 讀取 index.html
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// 測試結果
let passCount = 0;
let failCount = 0;

function test(condition, testName, requirement) {
    if (condition) {
        console.log(`✓ PASS: ${testName} (需求 ${requirement})`);
        passCount++;
    } else {
        console.log(`✗ FAIL: ${testName} (需求 ${requirement})`);
        failCount++;
    }
}

console.log('開始驗證 HTML 結構...\n');

// 測試 1: 檢查 amountInput 存在且 type="number"
test(
    htmlContent.includes('id="amountInput"') && htmlContent.includes('type="number"'),
    '金額輸入欄位 (amountInput) 存在且 type="number"',
    '2.2'
);

// 測試 2: 檢查 categorySelect 存在
test(
    htmlContent.includes('id="categorySelect"'),
    '類別下拉選單 (categorySelect) 存在',
    '2.3'
);

// 測試 3: 檢查三個類別選項存在
test(
    htmlContent.includes('value="飲食"') && 
    htmlContent.includes('value="交通"') && 
    htmlContent.includes('value="娛樂"'),
    'categorySelect 包含三個選項：飲食、交通、娛樂',
    '2.4'
);

// 測試 4: 檢查 addBtn 存在
test(
    htmlContent.includes('id="addBtn"'),
    '新增按鈕 (addBtn) 存在',
    '2.5'
);

// 測試 5: 檢查 expenseList 存在
test(
    htmlContent.includes('id="expenseList"'),
    '支出清單容器 (expenseList) 存在',
    '2.6'
);

// 測試 6: 檢查標題存在
test(
    htmlContent.includes('<h1>個人記帳本</h1>'),
    '標題「個人記帳本」存在',
    '2.1'
);

// 測試 7: 檢查今日總計顯示
test(
    htmlContent.includes('今日總計'),
    '今日總計顯示存在',
    '2.7'
);

// 測試 8: 檢查 CSS 引用
test(
    htmlContent.includes('href="style.css"'),
    'CSS 檔案 (style.css) 已正確引用',
    '1.2'
);

// 測試 9: 檢查 JavaScript 引用
test(
    htmlContent.includes('src="script.js"'),
    'JavaScript 檔案 (script.js) 已正確引用',
    '1.2'
);

// 測試 10: 檢查檔案存在
const cssExists = fs.existsSync(path.join(__dirname, 'style.css'));
const jsExists = fs.existsSync(path.join(__dirname, 'script.js'));

test(
    cssExists,
    'style.css 檔案存在',
    '1.1'
);

test(
    jsExists,
    'script.js 檔案存在',
    '1.1'
);

// 顯示測試摘要
console.log(`\n${'='.repeat(50)}`);
console.log(`測試完成：共 ${passCount + failCount} 個測試`);
console.log(`通過：${passCount} 個`);
console.log(`失敗：${failCount} 個`);
console.log(`${'='.repeat(50)}`);

// 返回退出碼
process.exit(failCount > 0 ? 1 : 0);
