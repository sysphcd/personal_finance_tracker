/**
 * 響應式設計測試
 * 驗證需求 3.5: 在小螢幕上調整佈局並確保易於使用
 */

// 由於這是純前端專案，我們使用簡單的測試方法
// 這個測試檔案可以在瀏覽器的開發者工具中執行

console.log('=== 響應式設計測試 ===\n');

// 測試 1: 檢查 CSS 檔案是否包含媒體查詢
async function testMediaQueryExists() {
    try {
        const response = await fetch('style.css');
        const cssContent = await response.text();
        
        const hasMediaQuery768 = cssContent.includes('@media (max-width: 768px)');
        const hasMediaQuery480 = cssContent.includes('@media (max-width: 480px)');
        
        console.log('✓ 測試 1: CSS 包含 768px 媒體查詢:', hasMediaQuery768);
        console.log('✓ 測試 2: CSS 包含 480px 媒體查詢:', hasMediaQuery480);
        
        return hasMediaQuery768 && hasMediaQuery480;
    } catch (error) {
        console.error('✗ 無法讀取 CSS 檔案:', error);
        return false;
    }
}

// 測試 2: 檢查 HTML 是否有 viewport meta 標籤
function testViewportMeta() {
    const viewport = document.querySelector('meta[name="viewport"]');
    const hasViewport = viewport !== null;
    const hasCorrectContent = viewport && viewport.content.includes('width=device-width');
    
    console.log('✓ 測試 3: HTML 包含 viewport meta 標籤:', hasViewport);
    console.log('✓ 測試 4: viewport 設定正確:', hasCorrectContent);
    
    return hasViewport && hasCorrectContent;
}

// 測試 3: 檢查在不同視窗寬度下的樣式
function testResponsiveStyles(width) {
    console.log(`\n--- 測試視窗寬度: ${width}px ---`);
    
    // 模擬視窗寬度（實際測試需要調整瀏覽器視窗）
    const container = document.querySelector('.container');
    const inputSection = document.querySelector('.input-section');
    const addBtn = document.getElementById('addBtn');
    const amountInput = document.getElementById('amountInput');
    
    if (!container || !inputSection || !addBtn || !amountInput) {
        console.error('✗ 找不到必要的 DOM 元素');
        return false;
    }
    
    const containerStyle = window.getComputedStyle(container);
    const inputSectionStyle = window.getComputedStyle(inputSection);
    const btnStyle = window.getComputedStyle(addBtn);
    const inputStyle = window.getComputedStyle(amountInput);
    
    console.log('容器樣式:');
    console.log('  - max-width:', containerStyle.maxWidth);
    console.log('  - margin:', containerStyle.margin);
    console.log('  - padding:', containerStyle.padding);
    
    console.log('輸入區域樣式:');
    console.log('  - flex-direction:', inputSectionStyle.flexDirection);
    console.log('  - gap:', inputSectionStyle.gap);
    
    console.log('按鈕樣式:');
    console.log('  - width:', btnStyle.width);
    console.log('  - height:', btnStyle.height);
    console.log('  - min-height:', btnStyle.minHeight);
    
    console.log('輸入欄位樣式:');
    console.log('  - width:', inputStyle.width);
    console.log('  - font-size:', inputStyle.fontSize);
    console.log('  - min-height:', inputStyle.minHeight);
    
    // 檢查小螢幕特定要求
    if (width <= 768) {
        const isColumnLayout = inputSectionStyle.flexDirection === 'column';
        const btnHeight = parseInt(btnStyle.height);
        const inputFontSize = parseInt(inputStyle.fontSize);
        
        console.log('\n小螢幕檢查:');
        console.log('✓ 輸入區域為垂直排列:', isColumnLayout);
        console.log('✓ 按鈕高度 ≥44px:', btnHeight >= 44, `(${btnHeight}px)`);
        console.log('✓ 輸入字體 ≥16px:', inputFontSize >= 16, `(${inputFontSize}px)`);
        
        return isColumnLayout && btnHeight >= 44 && inputFontSize >= 16;
    }
    
    return true;
}

// 測試 4: 檢查觸控目標尺寸
function testTouchTargets() {
    console.log('\n--- 觸控目標尺寸測試 ---');
    
    const addBtn = document.getElementById('addBtn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const amountInput = document.getElementById('amountInput');
    const categorySelect = document.getElementById('categorySelect');
    
    const elements = [
        { name: '新增按鈕', element: addBtn },
        { name: '金額輸入', element: amountInput },
        { name: '類別選單', element: categorySelect }
    ];
    
    let allPass = true;
    
    elements.forEach(({ name, element }) => {
        if (element) {
            const style = window.getComputedStyle(element);
            const height = parseInt(style.height);
            const minHeight = parseInt(style.minHeight) || 0;
            const effectiveHeight = Math.max(height, minHeight);
            const pass = effectiveHeight >= 44;
            
            console.log(`${pass ? '✓' : '✗'} ${name}: ${effectiveHeight}px ${pass ? '(符合 44px 最小尺寸)' : '(小於 44px)'}`);
            
            if (!pass) allPass = false;
        }
    });
    
    if (deleteButtons.length > 0) {
        const deleteBtn = deleteButtons[0];
        const style = window.getComputedStyle(deleteBtn);
        const height = parseInt(style.height);
        const minHeight = parseInt(style.minHeight) || 0;
        const effectiveHeight = Math.max(height, minHeight);
        const pass = effectiveHeight >= 36; // 刪除按鈕可以稍小
        
        console.log(`${pass ? '✓' : '✗'} 刪除按鈕: ${effectiveHeight}px ${pass ? '(符合 36px 最小尺寸)' : '(小於 36px)'}`);
        
        if (!pass) allPass = false;
    }
    
    return allPass;
}

// 執行所有測試
async function runAllTests() {
    console.log('開始執行響應式設計測試...\n');
    
    const results = [];
    
    // 測試 1 & 2: CSS 媒體查詢
    results.push(await testMediaQueryExists());
    
    // 測試 3 & 4: viewport meta
    results.push(testViewportMeta());
    
    // 測試 5: 響應式樣式
    const currentWidth = window.innerWidth;
    results.push(testResponsiveStyles(currentWidth));
    
    // 測試 6: 觸控目標
    results.push(testTouchTargets());
    
    // 總結
    console.log('\n=== 測試總結 ===');
    const passCount = results.filter(r => r).length;
    const totalCount = results.length;
    console.log(`通過: ${passCount}/${totalCount} 測試組`);
    
    if (passCount === totalCount) {
        console.log('✓ 所有響應式設計測試通過！');
    } else {
        console.log('✗ 部分測試未通過，請檢查上述輸出');
    }
    
    // 提供測試建議
    console.log('\n=== 測試建議 ===');
    console.log('1. 請調整瀏覽器視窗寬度至不同尺寸測試響應式行為');
    console.log('2. 建議測試的寬度: 320px, 480px, 768px, 1024px');
    console.log('3. 在行動裝置上實際測試觸控體驗');
    console.log('4. 使用瀏覽器開發者工具的裝置模擬器測試');
}

// 如果在瀏覽器環境中，自動執行測試
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }
}

// 匯出測試函式供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testMediaQueryExists,
        testViewportMeta,
        testResponsiveStyles,
        testTouchTargets,
        runAllTests
    };
}
