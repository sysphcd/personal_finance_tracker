#!/usr/bin/env node

/**
 * 單元測試：輸入驗證函式
 * **Validates: Requirements 4.3, 4.4**
 * 
 * 測試 validateInput() 函式正確驗證輸入
 */

// 複製 validateInput 函式
function validateInput(amount) {
    // 檢查是否為空值
    if (amount === null || amount === undefined || amount === '') {
        return {
            valid: false,
            message: '請輸入金額'
        };
    }
    
    // 轉換為數字
    const numAmount = parseFloat(amount);
    
    // 檢查是否為有效數字
    if (isNaN(numAmount)) {
        return {
            valid: false,
            message: '請輸入有效的數字'
        };
    }
    
    // 檢查金額是否 <= 0
    if (numAmount <= 0) {
        return {
            valid: false,
            message: '金額必須大於 0'
        };
    }
    
    // 驗證通過
    return {
        valid: true,
        message: ''
    };
}

// 測試函式
function runTests() {
    console.log('\n=== 單元測試：輸入驗證函式 ===\n');
    console.log('**Validates: Requirements 4.3, 4.4**\n');
    
    const tests = [];
    let allPassed = true;
    
    // 測試 1: 空字串應該被拒絕
    console.log('測試 1：空字串應該被拒絕...');
    const result1 = validateInput('');
    const test1 = !result1.valid && result1.message === '請輸入金額';
    tests.push({ name: '空字串', passed: test1, result: result1 });
    if (test1) {
        console.log(`✓ 通過 - ${result1.message}`);
    } else {
        console.log(`✗ 失敗 - 預期拒絕並顯示「請輸入金額」, 實際: ${JSON.stringify(result1)}`);
        allPassed = false;
    }
    
    // 測試 2: null 應該被拒絕
    console.log('\n測試 2：null 應該被拒絕...');
    const result2 = validateInput(null);
    const test2 = !result2.valid && result2.message === '請輸入金額';
    tests.push({ name: 'null', passed: test2, result: result2 });
    if (test2) {
        console.log(`✓ 通過 - ${result2.message}`);
    } else {
        console.log(`✗ 失敗 - 預期拒絕並顯示「請輸入金額」, 實際: ${JSON.stringify(result2)}`);
        allPassed = false;
    }
    
    // 測試 3: undefined 應該被拒絕
    console.log('\n測試 3：undefined 應該被拒絕...');
    const result3 = validateInput(undefined);
    const test3 = !result3.valid && result3.message === '請輸入金額';
    tests.push({ name: 'undefined', passed: test3, result: result3 });
    if (test3) {
        console.log(`✓ 通過 - ${result3.message}`);
    } else {
        console.log(`✗ 失敗 - 預期拒絕並顯示「請輸入金額」, 實際: ${JSON.stringify(result3)}`);
        allPassed = false;
    }
    
    // 測試 4: 零應該被拒絕
    console.log('\n測試 4：零應該被拒絕...');
    const result4 = validateInput(0);
    const test4 = !result4.valid && result4.message === '金額必須大於 0';
    tests.push({ name: '零', passed: test4, result: result4 });
    if (test4) {
        console.log(`✓ 通過 - ${result4.message}`);
    } else {
        console.log(`✗ 失敗 - 預期拒絕並顯示「金額必須大於 0」, 實際: ${JSON.stringify(result4)}`);
        allPassed = false;
    }
    
    // 測試 5: 負數應該被拒絕
    console.log('\n測試 5：負數應該被拒絕...');
    const result5 = validateInput(-10);
    const test5 = !result5.valid && result5.message === '金額必須大於 0';
    tests.push({ name: '負數', passed: test5, result: result5 });
    if (test5) {
        console.log(`✓ 通過 - ${result5.message}`);
    } else {
        console.log(`✗ 失敗 - 預期拒絕並顯示「金額必須大於 0」, 實際: ${JSON.stringify(result5)}`);
        allPassed = false;
    }
    
    // 測試 6: 字串 "0" 應該被拒絕
    console.log('\n測試 6：字串 "0" 應該被拒絕...');
    const result6 = validateInput('0');
    const test6 = !result6.valid && result6.message === '金額必須大於 0';
    tests.push({ name: '字串 "0"', passed: test6, result: result6 });
    if (test6) {
        console.log(`✓ 通過 - ${result6.message}`);
    } else {
        console.log(`✗ 失敗 - 預期拒絕並顯示「金額必須大於 0」, 實際: ${JSON.stringify(result6)}`);
        allPassed = false;
    }
    
    // 測試 7: 非數字字串應該被拒絕
    console.log('\n測試 7：非數字字串應該被拒絕...');
    const result7 = validateInput('abc');
    const test7 = !result7.valid && result7.message === '請輸入有效的數字';
    tests.push({ name: '非數字字串', passed: test7, result: result7 });
    if (test7) {
        console.log(`✓ 通過 - ${result7.message}`);
    } else {
        console.log(`✗ 失敗 - 預期拒絕並顯示「請輸入有效的數字」, 實際: ${JSON.stringify(result7)}`);
        allPassed = false;
    }
    
    // 測試 8: 正數應該通過
    console.log('\n測試 8：正數應該通過...');
    const result8 = validateInput(100);
    const test8 = result8.valid && result8.message === '';
    tests.push({ name: '正數 100', passed: test8, result: result8 });
    if (test8) {
        console.log(`✓ 通過 - 驗證成功`);
    } else {
        console.log(`✗ 失敗 - 預期通過驗證, 實際: ${JSON.stringify(result8)}`);
        allPassed = false;
    }
    
    // 測試 9: 字串形式的正數應該通過
    console.log('\n測試 9：字串形式的正數應該通過...');
    const result9 = validateInput('50');
    const test9 = result9.valid && result9.message === '';
    tests.push({ name: '字串 "50"', passed: test9, result: result9 });
    if (test9) {
        console.log(`✓ 通過 - 驗證成功`);
    } else {
        console.log(`✗ 失敗 - 預期通過驗證, 實際: ${JSON.stringify(result9)}`);
        allPassed = false;
    }
    
    // 測試 10: 小數應該通過
    console.log('\n測試 10：小數應該通過...');
    const result10 = validateInput(99.99);
    const test10 = result10.valid && result10.message === '';
    tests.push({ name: '小數 99.99', passed: test10, result: result10 });
    if (test10) {
        console.log(`✓ 通過 - 驗證成功`);
    } else {
        console.log(`✗ 失敗 - 預期通過驗證, 實際: ${JSON.stringify(result10)}`);
        allPassed = false;
    }
    
    // 測試 11: 極小的正數應該通過
    console.log('\n測試 11：極小的正數應該通過...');
    const result11 = validateInput(0.01);
    const test11 = result11.valid && result11.message === '';
    tests.push({ name: '極小正數 0.01', passed: test11, result: result11 });
    if (test11) {
        console.log(`✓ 通過 - 驗證成功`);
    } else {
        console.log(`✗ 失敗 - 預期通過驗證, 實際: ${JSON.stringify(result11)}`);
        allPassed = false;
    }
    
    // 總結
    console.log('\n' + '='.repeat(50));
    const passedCount = tests.filter(t => t.passed).length;
    console.log(`測試結果：${passedCount}/${tests.length} 通過`);
    
    if (allPassed) {
        console.log('✓ 所有單元測試通過！\n');
        process.exit(0);
    } else {
        console.log('✗ 部分單元測試失敗\n');
        process.exit(1);
    }
}

// 執行測試
runTests();
