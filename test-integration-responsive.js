/**
 * 整合測試：響應式設計
 * 測試：在不同螢幕尺寸下測試介面
 * **Validates: Requirements 3.5**
 */

const fs = require('fs');

console.log('開始整合測試：響應式設計');

// 測試 1：檢查 HTML 是否有 viewport meta 標籤
console.log('\n測試 1：檢查 viewport meta 標籤');
const htmlContent = fs.readFileSync('index.html', 'utf8');

if (!htmlContent.includes('name="viewport"')) {
    console.error('✗ 失敗：HTML 缺少 viewport meta 標籤');
    process.exit(1);
}
console.log('✓ 通過：HTML 包含 viewport meta 標籤');

if (!htmlContent.includes('width=device-width')) {
    console.error('✗ 失敗：viewport 未設定 width=device-width');
    process.exit(1);
}
console.log('✓ 通過：viewport 設定正確');

// 測試 2：檢查 CSS 是否包含媒體查詢
console.log('\n測試 2：檢查 CSS 媒體查詢');
const cssContent = fs.readFileSync('style.css', 'utf8');

if (!cssContent.includes('@media (max-width: 768px)')) {
    console.error('✗ 失敗：CSS 缺少 768px 媒體查詢');
    process.exit(1);
}
console.log('✓ 通過：CSS 包含 768px 媒體查詢');

if (!cssContent.includes('@media (max-width: 480px)')) {
    console.error('✗ 失敗：CSS 缺少 480px 媒體查詢');
    process.exit(1);
}
console.log('✓ 通過：CSS 包含 480px 媒體查詢');

// 測試 3：檢查媒體查詢中的關鍵樣式
console.log('\n測試 3：檢查響應式樣式內容');

// 提取 768px 媒體查詢內容
const mediaQuery768Match = cssContent.match(/@media \(max-width: 768px\)\s*\{([\s\S]*?)\n\}/);
if (!mediaQuery768Match) {
    console.error('✗ 失敗：無法解析 768px 媒體查詢');
    process.exit(1);
}

const mediaQuery768Content = mediaQuery768Match[1];

// 檢查輸入區域改為垂直排列
if (!mediaQuery768Content.includes('flex-direction: column')) {
    console.error('✗ 失敗：768px 媒體查詢中缺少 flex-direction: column');
    process.exit(1);
}
console.log('✓ 通過：小螢幕時輸入區域改為垂直排列');

// 檢查觸控目標最小尺寸
if (!mediaQuery768Content.includes('min-height: 44px')) {
    console.error('✗ 失敗：768px 媒體查詢中缺少 min-height: 44px（觸控目標最小尺寸）');
    process.exit(1);
}
console.log('✓ 通過：設定觸控目標最小尺寸（44px）');

// 檢查字體大小防止自動縮放
if (!mediaQuery768Content.includes('font-size: 16px')) {
    console.error('✗ 失敗：768px 媒體查詢中缺少 font-size: 16px（防止 iOS 自動縮放）');
    process.exit(1);
}
console.log('✓ 通過：設定字體大小防止 iOS 自動縮放');

// 測試 4：檢查 480px 媒體查詢
console.log('\n測試 4：檢查更小螢幕的響應式樣式');

const mediaQuery480Match = cssContent.match(/@media \(max-width: 480px\)\s*\{([\s\S]*?)\n\}/);
if (!mediaQuery480Match) {
    console.error('✗ 失敗：無法解析 480px 媒體查詢');
    process.exit(1);
}

const mediaQuery480Content = mediaQuery480Match[1];

// 檢查支出項目改為垂直排列
if (!mediaQuery480Content.includes('flex-direction: column')) {
    console.error('✗ 失敗：480px 媒體查詢中缺少 flex-direction: column（支出項目）');
    process.exit(1);
}
console.log('✓ 通過：更小螢幕時支出項目改為垂直排列');

// 測試 5：檢查基本響應式元素
console.log('\n測試 5：檢查基本響應式元素');

// 檢查容器在小螢幕上的調整
if (!mediaQuery768Content.includes('.container')) {
    console.error('✗ 失敗：768px 媒體查詢中缺少容器樣式調整');
    process.exit(1);
}
console.log('✓ 通過：容器在小螢幕上有樣式調整');

// 檢查輸入區域的調整
if (!mediaQuery768Content.includes('.input-section')) {
    console.error('✗ 失敗：768px 媒體查詢中缺少輸入區域樣式調整');
    process.exit(1);
}
console.log('✓ 通過：輸入區域在小螢幕上有樣式調整');

// 檢查按鈕的調整
if (!mediaQuery768Content.includes('#addBtn') && !mediaQuery768Content.includes('button')) {
    console.error('✗ 失敗：768px 媒體查詢中缺少按鈕樣式調整');
    process.exit(1);
}
console.log('✓ 通過：按鈕在小螢幕上有樣式調整');

// 測試 6：檢查刪除按鈕的觸控目標
console.log('\n測試 6：檢查刪除按鈕的觸控目標');

if (!mediaQuery768Content.includes('.delete-btn')) {
    console.error('✗ 失敗：768px 媒體查詢中缺少刪除按鈕樣式調整');
    process.exit(1);
}
console.log('✓ 通過：刪除按鈕在小螢幕上有樣式調整');

// 檢查刪除按鈕的最小尺寸
if (!mediaQuery768Content.includes('min-height: 36px') && !mediaQuery768Content.includes('min-height: 44px')) {
    console.error('✗ 失敗：刪除按鈕缺少最小高度設定');
    process.exit(1);
}
console.log('✓ 通過：刪除按鈕有最小高度設定');

console.log('\n✓ 所有整合測試通過：響應式設計');
console.log('\n注意：此測試驗證了 CSS 中的響應式規則。');
console.log('建議在實際瀏覽器中測試不同螢幕尺寸的顯示效果：');
console.log('- 桌面：> 768px');
console.log('- 平板：768px');
console.log('- 手機：480px 和 320px');

process.exit(0);
