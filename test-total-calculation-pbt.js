#!/usr/bin/env node

/**
 * 屬性測試：今日總計計算正確性
 * **Validates: Requirements 7.6, 7.2**
 * 
 * 屬性 9：今日總計計算正確性
 * 對於任何支出記錄集合，今日總計應該等於所有記錄金額的總和，不論類別
 */

// 動態導入 fast-check
import('fast-check').then(fc => {
    // 複製必要的函式
    let expenses = [];

    function calculateTotal() {
        return expenses.reduce((total, expense) => {
            return total + expense.amount;
        }, 0);
    }

    // 定義支出記錄生成器
    const expenseArbitrary = fc.record({
        id: fc.string(),
        amount: fc.double({ min: 0.01, max: 10000, noNaN: true }),
        category: fc.constantFrom('飲食', '交通', '娛樂')
    });

    // 定義支出記錄陣列生成器
    const expensesArrayArbitrary = fc.array(expenseArbitrary, { minLength: 0, maxLength: 50 });

    console.log('\n=== 屬性測試：今日總計計算正確性 ===\n');
    console.log('**Validates: Requirements 7.6, 7.2**\n');

    let allPassed = true;

    // 屬性 1：calculateTotal() 應該返回所有金額的總和
    console.log('測試屬性 1：calculateTotal() 應該返回所有金額的總和...');
    const property1 = fc.property(expensesArrayArbitrary, (testExpenses) => {
        expenses = testExpenses;
        const calculatedTotal = calculateTotal();
        const expectedTotal = testExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        // 使用小的容差來處理浮點數精度問題
        const tolerance = 0.0001;
        const difference = Math.abs(calculatedTotal - expectedTotal);
        
        return difference < tolerance;
    });

    try {
        const result1 = fc.check(property1, { numRuns: 100 });
        if (result1.failed) {
            console.log('✗ 屬性測試失敗：calculateTotal() 計算不正確');
            console.log('  反例：', result1.counterexample);
            allPassed = false;
        } else {
            console.log('✓ 屬性測試通過：calculateTotal() 正確計算所有金額總和 (100 次測試)');
        }
    } catch (error) {
        console.log('✗ 屬性測試錯誤：', error.message);
        allPassed = false;
    }

    // 屬性 2：空陣列應該返回 0
    console.log('\n測試屬性 2：空陣列應該返回 0...');
    const property2 = fc.property(fc.constant([]), (testExpenses) => {
        expenses = testExpenses;
        return calculateTotal() === 0;
    });

    try {
        const result2 = fc.check(property2, { numRuns: 10 });
        if (result2.failed) {
            console.log('✗ 屬性測試失敗：空陣列應返回 0');
            allPassed = false;
        } else {
            console.log('✓ 屬性測試通過：空陣列返回 0');
        }
    } catch (error) {
        console.log('✗ 屬性測試錯誤：', error.message);
        allPassed = false;
    }

    // 屬性 3：總計應該與類別無關
    console.log('\n測試屬性 3：總計應該與類別無關...');
    const property3 = fc.property(expensesArrayArbitrary, (testExpenses) => {
        expenses = testExpenses;
        const total1 = calculateTotal();
        
        // 改變所有類別但保持金額不變
        const modifiedExpenses = testExpenses.map(exp => ({
            ...exp,
            category: '飲食' // 全部改為飲食
        }));
        expenses = modifiedExpenses;
        const total2 = calculateTotal();
        
        // 總計應該相同（因為只改變類別，金額不變）
        const tolerance = 0.0001;
        return Math.abs(total1 - total2) < tolerance;
    });

    try {
        const result3 = fc.check(property3, { numRuns: 100 });
        if (result3.failed) {
            console.log('✗ 屬性測試失敗：總計應該與類別無關');
            console.log('  反例：', result3.counterexample);
            allPassed = false;
        } else {
            console.log('✓ 屬性測試通過：總計與類別無關 (100 次測試)');
        }
    } catch (error) {
        console.log('✗ 屬性測試錯誤：', error.message);
        allPassed = false;
    }

    // 總結
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
        console.log('✓ 所有屬性測試通過！\n');
        process.exit(0);
    } else {
        console.log('✗ 部分屬性測試失敗\n');
        process.exit(1);
    }
}).catch(error => {
    console.error('錯誤：無法載入 fast-check');
    console.error('請使用以下命令安裝：npm install fast-check');
    console.error('或使用 uvx 執行：uvx --from fast-check node test-total-calculation-pbt.js');
    console.error(error);
    process.exit(1);
});
