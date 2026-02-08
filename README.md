# personal_finance_tracker
built a person finance tracker with spec coding in Kiro

## 記帳本（最小可用版）EARS 條款（你可直接當驗收規格）

### A. 新增成功（事件觸發）

- WHEN 使用者點擊「新增」且金額驗證通過，the system SHALL
    - 將支出新增到今日清單
    - 更新今日總額
    - 清空金額輸入框

### B. 金額驗證（條件判斷）

- IF 金額欄位為空白，the system SHALL
    - 顯示「請輸入金額」
    - 不得新增支出
- IF 金額不是數字，the system SHALL
    - 顯示「金額需為數字」
    - 不得新增支出
- IF 金額 <= 0，the system SHALL
    - 顯示「金額需大於 0」
    - 不得新增支出

### C. 空狀態（狀態維持）

- WHILE 今日清單沒有任何支出，the system SHALL
    - 顯示空狀態文字（例如：今天還沒有紀錄）
    - 今日總額顯示為 0

### D. 保存與載入（事件觸發 + 條件判斷）

- WHEN 新增支出成功，the system SHALL
    - 將最新清單寫入 localStorage
- WHEN 使用者重新整理頁面，the system SHALL
    - 從 localStorage 載入資料並渲染清單與總額
- IF localStorage 沒有任何資料，the system SHALL
    - 顯示空狀態
    - 不得報錯
    
## 比較表一般需求寫法 vs EARS 寫法（你會立刻懂差別）
你可能會這樣寫	問題	改成 EARS 會變成
新增支出後要更新畫面	「更新」太模糊	WHEN 新增成功，SHALL 清單新增一筆 + 總額更新 + 清空輸入
金額要驗證	沒說清楚規則	IF 空白/非數字/<=0，SHALL 顯示提示且不新增
沒資料要顯示提示	沒說何時算「沒資料」	WHILE 清單為空，SHALL 顯示空狀態且總額為 0
要保存資料	沒說保存時機	WHEN 新增成功，SHALL 寫入 localStorage；WHEN 重新整理，SHALL 載入

## 核心

就是把「用感覺寫程式」變成「照規格穩穩做完」。

- 先把需求講到不需要猜：用幾個關鍵問題把「要做什麼、給誰用、解決什麼、做哪些功能」定住，再補上基本設計（資料存哪、資料長怎樣、流程怎麼走、錯誤怎麼處理）。
- 把大目標拆成小步驟：每一步都要具體、短、做完立刻能驗收，然後照順序一段一段交付，避免一次做太大而失控。
- 用 **EARS** 把需求寫成可驗收規則：用 WHEN/IF/WHILE/WHERE 把「什麼情境」和「系統必須做什麼」寫清楚，最好寫到看得見結果（清單新增、總額更新、顯示錯誤、空狀態…）。

你把這三件事做到，Kiro（或任何 AI 工具）就會更像在「照施工圖施工」，而不是在「猜你想要什麼」。

## Prompt

【專案名稱】
個人記帳本（純前端：HTML / CSS / JavaScript）

【專案目標】
做一個簡單的記帳小工具，使用者可以輸入金額、選分類、按新增後看到清單；可刪除；資料使用 localStorage 保存；顯示「今日總計」；手機也不爆版。

【範圍與限制（很重要）】

- 不使用框架、不使用打包工具
- 不引入外部套件或 CDN
- 只有三個檔案：index.html、style.css、script.js
- 先做 UI + localStorage（不做登入、不接後端）
- 不做拖拉、不做複雜圖表

【UI（必須出現在 requirements）】

- 標題：個人記帳本
- 金額輸入框（id="amountInput"，type number）
- 分類下拉（id="categorySelect"；選項：飲食/交通/娛樂）
- 新增按鈕（id="addBtn"）
- 清單容器（id="expenseList"）
- 顯示「今日總計：XXX 元」（放在清單上方或標題下方）

【功能需求（請拆成清楚的 User Stories + Acceptance Criteria）】
Phase 1 建立專案骨架：資料夾與三檔案、正確引用
Phase 2 基本介面：輸入框/下拉/按鈕/清單容器（先不需要功能）
Phase 3 美化：背景淺灰、按鈕綠色、圓角、合理間距、乾淨好讀、基本 RWD
Phase 4 新增支出：按新增後顯示「分類 - 金額 元」；金額<=0或空要阻止並提示；新增成功清空輸入
Phase 5 localStorage + 刪除：重整不消失；每筆旁邊有刪除按鈕；刪除同步更新 localStorage