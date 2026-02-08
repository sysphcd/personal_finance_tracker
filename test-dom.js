// DOM 元素單元測試
// 需求：2.2, 2.3, 2.4, 2.5, 2.6

// 由於這是純前端專案，此測試檔案用於文件記錄
// 實際測試請在瀏覽器中開啟 test-dom-elements.html

/**
 * 測試套件：DOM 元素存在性驗證
 * 
 * 此測試套件驗證 index.html 中所有必要的 DOM 元素是否正確存在
 * 並具有正確的屬性和內容。
 */

const tests = [
    {
        name: '金額輸入欄位 (amountInput) 存在',
        requirement: '2.2',
        test: () => {
            const element = document.getElementById('amountInput');
            return element !== null;
        }
    },
    {
        name: 'amountInput 的 type 屬性為 "number"',
        requirement: '2.2',
        test: () => {
            const element = document.getElementById('amountInput');
            return element && element.type === 'number';
        }
    },
    {
        name: '類別下拉選單 (categorySelect) 存在',
        requirement: '2.3',
        test: () => {
            const element = document.getElementById('categorySelect');
            return element !== null;
        }
    },
    {
        name: 'categorySelect 包含三個選項',
        requirement: '2.4',
        test: () => {
            const element = document.getElementById('categorySelect');
            return element && element.options.length === 3;
        }
    },
    {
        name: '第一個選項是「飲食」',
        requirement: '2.4',
        test: () => {
            const element = document.getElementById('categorySelect');
            return element && element.options[0].value === '飲食';
        }
    },
    {
        name: '第二個選項是「交通」',
        requirement: '2.4',
        test: () => {
            const element = document.getElementById('categorySelect');
            return element && element.options[1].value === '交通';
        }
    },
    {
        name: '第三個選項是「娛樂」',
        requirement: '2.4',
        test: () => {
            const element = document.getElementById('categorySelect');
            return element && element.options[2].value === '娛樂';
        }
    },
    {
        name: '新增按鈕 (addBtn) 存在',
        requirement: '2.5',
        test: () => {
            const element = document.getElementById('addBtn');
            return element !== null;
        }
    },
    {
        name: '支出清單容器 (expenseList) 存在',
        requirement: '2.6',
        test: () => {
            const element = document.getElementById('expenseList');
            return element !== null;
        }
    },
    {
        name: '標題「個人記帳本」存在',
        requirement: '2.1',
        test: () => {
            const element = document.querySelector('h1');
            return element && element.textContent === '個人記帳本';
        }
    },
    {
        name: '今日總計顯示區域存在',
        requirement: '2.7',
        test: () => {
            const element = document.querySelector('.total-display');
            return element !== null;
        }
    },
    {
        name: 'CSS 檔案 (style.css) 已正確引用',
        requirement: '1.2',
        test: () => {
            const element = document.querySelector('link[href="style.css"]');
            return element !== null;
        }
    },
    {
        name: 'JavaScript 檔案 (script.js) 已正確引用',
        requirement: '1.2',
        test: () => {
            const element = document.querySelector('script[src="script.js"]');
            return element !== null;
        }
    }
];

// 測試執行函式（在瀏覽器環境中使用）
function runTests() {
    let passCount = 0;
    let failCount = 0;
    
    console.log('開始執行 DOM 元素測試...\n');
    
    tests.forEach(test => {
        try {
            const result = test.test();
            if (result) {
                console.log(`✓ PASS: ${test.name} (需求 ${test.requirement})`);
                passCount++;
            } else {
                console.log(`✗ FAIL: ${test.name} (需求 ${test.requirement})`);
                failCount++;
            }
        } catch (error) {
            console.log(`✗ ERROR: ${test.name} - ${error.message}`);
            failCount++;
        }
    });
    
    console.log(`\n測試完成：共 ${tests.length} 個測試，${passCount} 個通過，${failCount} 個失敗`);
    
    return failCount === 0;
}

// 如果在瀏覽器環境中，自動執行測試
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', runTests);
}

// 匯出供其他測試使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tests, runTests };
}
