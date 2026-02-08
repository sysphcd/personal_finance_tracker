// 測試清單和總計顯示樣式
// 此測試驗證 CSS 樣式是否正確應用到 DOM 元素

function testListAndTotalStyles() {
    console.log('開始測試清單和總計顯示樣式...');
    
    let passedTests = 0;
    let totalTests = 0;
    
    // 測試 1: 總計顯示容器存在且有正確的類別
    totalTests++;
    const totalDisplay = document.querySelector('.total-display');
    if (totalDisplay) {
        console.log('✓ 測試 1 通過: 總計顯示容器存在');
        passedTests++;
    } else {
        console.error('✗ 測試 1 失敗: 找不到 .total-display 元素');
    }
    
    // 測試 2: 總計顯示有正確的樣式屬性
    totalTests++;
    if (totalDisplay) {
        const styles = window.getComputedStyle(totalDisplay);
        const hasBackgroundColor = styles.backgroundColor !== 'rgba(0, 0, 0, 0)';
        const hasPadding = parseInt(styles.padding) > 0;
        const hasBorderRadius = parseInt(styles.borderRadius) > 0;
        const isTextCentered = styles.textAlign === 'center';
        
        if (hasBackgroundColor && hasPadding && hasBorderRadius && isTextCentered) {
            console.log('✓ 測試 2 通過: 總計顯示有正確的樣式');
            passedTests++;
        } else {
            console.error('✗ 測試 2 失敗: 總計顯示樣式不完整');
            console.log('  背景色:', hasBackgroundColor);
            console.log('  內距:', hasPadding);
            console.log('  圓角:', hasBorderRadius);
            console.log('  文字置中:', isTextCentered);
        }
    }
    
    // 測試 3: 清單項目有正確的樣式
    totalTests++;
    const expenseItems = document.querySelectorAll('.expense-item');
    if (expenseItems.length > 0) {
        const firstItem = expenseItems[0];
        const styles = window.getComputedStyle(firstItem);
        const isFlexbox = styles.display === 'flex';
        const hasBackgroundColor = styles.backgroundColor !== 'rgba(0, 0, 0, 0)';
        const hasPadding = parseInt(styles.padding) > 0;
        const hasBorderRadius = parseInt(styles.borderRadius) > 0;
        const hasLeftBorder = parseInt(styles.borderLeftWidth) > 0;
        
        if (isFlexbox && hasBackgroundColor && hasPadding && hasBorderRadius && hasLeftBorder) {
            console.log('✓ 測試 3 通過: 清單項目有正確的樣式');
            passedTests++;
        } else {
            console.error('✗ 測試 3 失敗: 清單項目樣式不完整');
            console.log('  Flexbox:', isFlexbox);
            console.log('  背景色:', hasBackgroundColor);
            console.log('  內距:', hasPadding);
            console.log('  圓角:', hasBorderRadius);
            console.log('  左邊框:', hasLeftBorder);
        }
    } else {
        console.error('✗ 測試 3 失敗: 找不到 .expense-item 元素');
    }
    
    // 測試 4: 刪除按鈕有正確的樣式
    totalTests++;
    const deleteButtons = document.querySelectorAll('.delete-btn');
    if (deleteButtons.length > 0) {
        const firstBtn = deleteButtons[0];
        const styles = window.getComputedStyle(firstBtn);
        const hasBackgroundColor = styles.backgroundColor !== 'rgba(0, 0, 0, 0)';
        const hasWhiteText = styles.color === 'rgb(255, 255, 255)' || styles.color === 'white';
        const hasBorderRadius = parseInt(styles.borderRadius) > 0;
        const hasCursorPointer = styles.cursor === 'pointer';
        
        if (hasBackgroundColor && hasWhiteText && hasBorderRadius && hasCursorPointer) {
            console.log('✓ 測試 4 通過: 刪除按鈕有正確的樣式');
            passedTests++;
        } else {
            console.error('✗ 測試 4 失敗: 刪除按鈕樣式不完整');
            console.log('  背景色:', hasBackgroundColor);
            console.log('  白色文字:', hasWhiteText);
            console.log('  圓角:', hasBorderRadius);
            console.log('  指標游標:', hasCursorPointer);
        }
    } else {
        console.error('✗ 測試 4 失敗: 找不到 .delete-btn 元素');
    }
    
    // 測試 5: 清單項目之間有適當的間距
    totalTests++;
    if (expenseItems.length > 1) {
        const firstItem = expenseItems[0];
        const styles = window.getComputedStyle(firstItem);
        const hasMarginBottom = parseInt(styles.marginBottom) > 0;
        
        if (hasMarginBottom) {
            console.log('✓ 測試 5 通過: 清單項目之間有適當的間距');
            passedTests++;
        } else {
            console.error('✗ 測試 5 失敗: 清單項目沒有下邊距');
        }
    } else {
        console.log('⊘ 測試 5 跳過: 需要至少兩個清單項目');
    }
    
    // 測試 6: 總計文字有粗體樣式
    totalTests++;
    const totalText = document.querySelector('.total-display p');
    if (totalText) {
        const styles = window.getComputedStyle(totalText);
        const isBold = parseInt(styles.fontWeight) >= 700 || styles.fontWeight === 'bold';
        const hasLargerFont = parseFloat(styles.fontSize) > 16;
        
        if (isBold && hasLargerFont) {
            console.log('✓ 測試 6 通過: 總計文字有粗體和較大字體');
            passedTests++;
        } else {
            console.error('✗ 測試 6 失敗: 總計文字樣式不完整');
            console.log('  粗體:', isBold);
            console.log('  較大字體:', hasLargerFont);
        }
    } else {
        console.error('✗ 測試 6 失敗: 找不到 .total-display p 元素');
    }
    
    // 輸出測試結果
    console.log('\n========================================');
    console.log(`測試完成: ${passedTests}/${totalTests} 通過`);
    console.log('========================================\n');
    
    return passedTests === totalTests;
}

// 當 DOM 載入完成後執行測試
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testListAndTotalStyles);
} else {
    testListAndTotalStyles();
}
