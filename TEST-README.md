# 個人記帳本測試文件

## 測試概述

本專案包含單元測試來驗證 DOM 元素的存在性和正確性。

## 測試檔案

### 1. verify-structure.js
Node.js 腳本，用於驗證 HTML 結構是否包含所有必要的元素。

**執行方式：**
```bash
node verify-structure.js
```

**測試內容：**
- 驗證 `amountInput` 元素存在且 type="number"
- 驗證 `categorySelect` 元素存在
- 驗證三個類別選項（飲食、交通、娛樂）存在
- 驗證 `addBtn` 元素存在
- 驗證 `expenseList` 元素存在
- 驗證標題「個人記帳本」存在
- 驗證今日總計顯示存在
- 驗證 CSS 和 JavaScript 檔案正確引用
- 驗證所有檔案存在

### 2. test-dom-elements.html
瀏覽器測試頁面，提供視覺化的測試結果。

**執行方式：**
1. 在瀏覽器中開啟 `test-dom-elements.html`
2. 測試會自動執行並顯示結果

**測試內容：**
- 所有 verify-structure.js 的測試
- 額外的 DOM 屬性驗證
- 視覺化的測試結果顯示

### 3. test-dom.js
測試定義檔案，包含所有測試案例的定義。

**用途：**
- 文件記錄
- 可在瀏覽器 console 中執行
- 提供測試案例的詳細說明

## 測試結果

### 當前測試狀態
✅ 所有 11 個測試通過

### 測試覆蓋的需求
- 需求 1.1: 專案結構（三個檔案）
- 需求 1.2: 檔案引用正確
- 需求 2.1: 標題顯示
- 需求 2.2: 金額輸入欄位
- 需求 2.3: 類別下拉選單
- 需求 2.4: 三個類別選項
- 需求 2.5: 新增按鈕
- 需求 2.6: 支出清單容器
- 需求 2.7: 今日總計顯示

## 執行所有測試

```bash
# 執行結構驗證測試
node verify-structure.js

# 在瀏覽器中開啟視覺化測試
# 直接開啟 test-dom-elements.html
```

### 4. test-localstorage-roundtrip-pbt.js
Node.js 屬性測試腳本，使用 fast-check 進行 localStorage 往返一致性測試。

**執行方式：**
```bash
# 安裝依賴（首次執行）
npm install

# 執行屬性測試
node test-localstorage-roundtrip-pbt.js

# 或使用 npm 腳本
npm run test:pbt-roundtrip
```

**測試內容：**
- 生成隨機支出記錄陣列（0-100 筆）
- 驗證儲存到 localStorage 後再載入的資料一致性
- 執行 100 次測試迭代
- 驗證 id、amount、category 資訊完整保留

### 5. test-localstorage-roundtrip-pbt.html
瀏覽器環境的屬性測試介面。

**執行方式：**
1. 在瀏覽器中開啟 `test-localstorage-roundtrip-pbt.html`
2. 點擊「執行屬性測試」按鈕
3. 查看測試結果

**測試內容：**
- 簡化版的屬性測試實作
- 視覺化測試結果顯示
- 執行 100 次隨機測試

## 測試原則

根據設計文件的測試策略：
- ✅ 單元測試：驗證特定範例和邊界情況
- ✅ DOM 元素存在性檢查
- ✅ 屬性測試：驗證跨所有輸入的通用屬性（已實作 localStorage 往返一致性）

## 注意事項

- 本專案不使用任何外部測試框架（如 Jest、Mocha）
- 測試使用純 JavaScript 和 Node.js 內建模組
- 瀏覽器測試使用 iframe 載入實際的 index.html
- 所有測試都標記了對應的需求編號以確保可追溯性
