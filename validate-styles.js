// 驗證 CSS 樣式文件包含所有必要的樣式規則
const fs = require('fs');

function validateStyles() {
    console.log('開始驗證 CSS 樣式...\n');
    
    // 讀取 CSS 文件
    const cssContent = fs.readFileSync('style.css', 'utf8');
    
    let passedTests = 0;
    let totalTests = 0;
    
    // 測試 1: 檢查總計顯示樣式
    totalTests++;
    const hasTotalDisplay = cssContent.includes('.total-display');
    const hasTotalDisplayP = cssContent.includes('.total-display p');
    if (hasTotalDisplay && hasTotalDisplayP) {
        console.log('✓ 測試 1 通過: 總計顯示樣式存在');
        passedTests++;
        
        // 檢查具體屬性
        const totalDisplaySection = cssContent.match(/\.total-display\s*{[^}]+}/s);
        if (totalDisplaySection) {
            const section = totalDisplaySection[0];
            const hasBackground = section.includes('background-color');
            const hasPadding = section.includes('padding');
            const hasBorderRadius = section.includes('border-radius');
            const hasTextAlign = section.includes('text-align');
            
            console.log('  - 背景色:', hasBackground ? '✓' : '✗');
            console.log('  - 內距:', hasPadding ? '✓' : '✗');
            console.log('  - 圓角:', hasBorderRadius ? '✓' : '✗');
            console.log('  - 文字對齊:', hasTextAlign ? '✓' : '✗');
        }
    } else {
        console.error('✗ 測試 1 失敗: 總計顯示樣式缺失');
    }
    
    // 測試 2: 檢查清單項目樣式
    totalTests++;
    const hasExpenseItem = cssContent.includes('.expense-item');
    if (hasExpenseItem) {
        console.log('\n✓ 測試 2 通過: 清單項目樣式存在');
        passedTests++;
        
        const expenseItemSection = cssContent.match(/\.expense-item\s*{[^}]+}/s);
        if (expenseItemSection) {
            const section = expenseItemSection[0];
            const hasDisplay = section.includes('display');
            const hasJustifyContent = section.includes('justify-content');
            const hasAlignItems = section.includes('align-items');
            const hasPadding = section.includes('padding');
            const hasBackground = section.includes('background-color');
            const hasBorderRadius = section.includes('border-radius');
            const hasBorderLeft = section.includes('border-left');
            
            console.log('  - Display (Flexbox):', hasDisplay ? '✓' : '✗');
            console.log('  - Justify Content:', hasJustifyContent ? '✓' : '✗');
            console.log('  - Align Items:', hasAlignItems ? '✓' : '✗');
            console.log('  - 內距:', hasPadding ? '✓' : '✗');
            console.log('  - 背景色:', hasBackground ? '✓' : '✗');
            console.log('  - 圓角:', hasBorderRadius ? '✓' : '✗');
            console.log('  - 左邊框:', hasBorderLeft ? '✓' : '✗');
        }
    } else {
        console.error('\n✗ 測試 2 失敗: 清單項目樣式缺失');
    }
    
    // 測試 3: 檢查刪除按鈕樣式
    totalTests++;
    const hasDeleteBtn = cssContent.includes('.delete-btn');
    if (hasDeleteBtn) {
        console.log('\n✓ 測試 3 通過: 刪除按鈕樣式存在');
        passedTests++;
        
        const deleteBtnSection = cssContent.match(/\.delete-btn\s*{[^}]+}/s);
        if (deleteBtnSection) {
            const section = deleteBtnSection[0];
            const hasPadding = section.includes('padding');
            const hasBackground = section.includes('background-color');
            const hasColor = section.includes('color');
            const hasBorder = section.includes('border');
            const hasBorderRadius = section.includes('border-radius');
            const hasCursor = section.includes('cursor');
            
            console.log('  - 內距:', hasPadding ? '✓' : '✗');
            console.log('  - 背景色:', hasBackground ? '✓' : '✗');
            console.log('  - 文字顏色:', hasColor ? '✓' : '✗');
            console.log('  - 邊框:', hasBorder ? '✓' : '✗');
            console.log('  - 圓角:', hasBorderRadius ? '✓' : '✗');
            console.log('  - 游標:', hasCursor ? '✓' : '✗');
        }
    } else {
        console.error('\n✗ 測試 3 失敗: 刪除按鈕樣式缺失');
    }
    
    // 測試 4: 檢查刪除按鈕 hover 效果
    totalTests++;
    const hasDeleteBtnHover = cssContent.includes('.delete-btn:hover');
    if (hasDeleteBtnHover) {
        console.log('\n✓ 測試 4 通過: 刪除按鈕 hover 效果存在');
        passedTests++;
    } else {
        console.error('\n✗ 測試 4 失敗: 刪除按鈕 hover 效果缺失');
    }
    
    // 測試 5: 檢查清單容器樣式
    totalTests++;
    const hasExpenseList = cssContent.includes('#expenseList');
    if (hasExpenseList) {
        console.log('\n✓ 測試 5 通過: 清單容器樣式存在');
        passedTests++;
    } else {
        console.error('\n✗ 測試 5 失敗: 清單容器樣式缺失');
    }
    
    // 測試 6: 檢查間距設定（需求 3.4）
    totalTests++;
    const hasMarginBottom = cssContent.match(/\.expense-item[^}]*margin-bottom/s);
    const hasTotalDisplayMargin = cssContent.match(/\.total-display[^}]*margin-bottom/s);
    if (hasMarginBottom && hasTotalDisplayMargin) {
        console.log('\n✓ 測試 6 通過: 元素之間有適當的間距設定');
        passedTests++;
    } else {
        console.error('\n✗ 測試 6 失敗: 缺少間距設定');
        console.log('  - 清單項目間距:', hasMarginBottom ? '✓' : '✗');
        console.log('  - 總計顯示間距:', hasTotalDisplayMargin ? '✓' : '✗');
    }
    
    // 輸出測試結果
    console.log('\n========================================');
    console.log(`測試完成: ${passedTests}/${totalTests} 通過`);
    console.log('========================================\n');
    
    if (passedTests === totalTests) {
        console.log('✓ 所有樣式驗證通過！');
        console.log('任務 2.3「設計清單和總計顯示樣式」已完成。\n');
        process.exit(0);
    } else {
        console.error('✗ 部分樣式驗證失敗，請檢查 CSS 文件。\n');
        process.exit(1);
    }
}

// 執行驗證
try {
    validateStyles();
} catch (error) {
    console.error('驗證過程中發生錯誤:', error.message);
    process.exit(1);
}
