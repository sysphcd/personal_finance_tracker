# 需求文件

## 簡介

個人記帳本是一個簡單的支出追蹤工具，讓使用者能夠輸入金額、選擇類別、新增記錄到清單、刪除記錄、使用 localStorage 持久化資料、顯示「今日總計」，並確保行動裝置響應式設計。此應用程式僅使用純前端技術（HTML / CSS / JavaScript），不使用任何框架、建置工具或外部套件。

## 術語表

- **System（系統）**：個人記帳本網頁應用程式
- **User（使用者）**：使用此記帳本的人
- **Expense_Entry（支出記錄）**：包含金額和類別的單筆支出資料
- **localStorage**：瀏覽器提供的本地儲存機制
- **Today_Total（今日總計）**：當日所有支出記錄的金額總和

## 需求

### 需求 1：專案結構

**使用者故事：** 作為開發者，我想要建立正確的專案結構，以便應用程式能夠正常運作。

#### 驗收標準

1. THE System SHALL consist of exactly three files: index.html, style.css, and script.js
2. WHEN index.html is opened, THE System SHALL correctly reference style.css and script.js
3. THE System SHALL NOT include any external frameworks, build tools, or CDN dependencies
4. THE System SHALL NOT include any package.json or node_modules directory

### 需求 2：基本介面元素

**使用者故事：** 作為使用者，我想要看到所有必要的介面元素，以便我能夠輸入和管理支出記錄。

#### 驗收標準

1. WHEN the page loads, THE System SHALL display a title "個人記帳本"
2. THE System SHALL provide an amount input field with id="amountInput" and type="number"
3. THE System SHALL provide a category dropdown with id="categorySelect"
4. THE Category_Dropdown SHALL contain exactly three options: "飲食", "交通", and "娛樂"
5. THE System SHALL provide an add button with id="addBtn"
6. THE System SHALL provide an expense list container with id="expenseList"
7. THE System SHALL display "今日總計：XXX 元" where XXX is the sum of all expenses

### 需求 3：視覺樣式

**使用者故事：** 作為使用者，我想要一個乾淨且易讀的介面，以便我能夠舒適地使用應用程式。

#### 驗收標準

1. THE System SHALL apply a light gray background color to the page
2. THE Add_Button SHALL be styled with a green color
3. THE System SHALL apply rounded corners to interactive elements
4. THE System SHALL apply reasonable spacing between elements for readability
5. WHEN the viewport width is less than 768 pixels, THE System SHALL adjust the layout for mobile devices
6. THE System SHALL maintain a clean and readable appearance across all screen sizes

### 需求 4：新增支出記錄

**使用者故事：** 作為使用者，我想要新增支出記錄到清單，以便我能夠追蹤我的支出。

#### 驗收標準

1. WHEN the user clicks the add button with valid input, THE System SHALL create a new Expense_Entry
2. WHEN a new Expense_Entry is created, THE System SHALL display it in the format "分類 - 金額 元"
3. WHEN the user attempts to add an expense with amount less than or equal to zero, THE System SHALL prevent the addition and display an alert message
4. WHEN the user attempts to add an expense with an empty amount field, THE System SHALL prevent the addition and display an alert message
5. WHEN a valid Expense_Entry is successfully added, THE System SHALL clear the amount input field
6. WHEN a valid Expense_Entry is successfully added, THE System SHALL reset the category dropdown to the first option

### 需求 5：資料持久化

**使用者故事：** 作為使用者，我想要我的支出記錄在頁面重新整理後仍然保留，以便我不會遺失資料。

#### 驗收標準

1. WHEN a new Expense_Entry is added, THE System SHALL immediately save it to localStorage
2. WHEN the page loads, THE System SHALL retrieve all Expense_Entry data from localStorage
3. WHEN the page loads with existing data in localStorage, THE System SHALL display all saved Expense_Entry items
4. WHEN an Expense_Entry is deleted, THE System SHALL immediately update localStorage to reflect the deletion
5. THE System SHALL store Expense_Entry data in a format that preserves both amount and category information

### 需求 6：刪除支出記錄

**使用者故事：** 作為使用者，我想要刪除支出記錄，以便我能夠修正錯誤或移除不需要的記錄。

#### 驗收標準

1. WHEN an Expense_Entry is displayed, THE System SHALL provide a delete button for that entry
2. WHEN the user clicks a delete button, THE System SHALL remove the corresponding Expense_Entry from the display
3. WHEN an Expense_Entry is deleted, THE System SHALL update localStorage to remove that entry
4. WHEN an Expense_Entry is deleted, THE System SHALL update the Today_Total immediately

### 需求 7：今日總計顯示

**使用者故事：** 作為使用者，我想要看到今日所有支出的總和，以便我能夠了解我今天花了多少錢。

#### 驗收標準

1. THE System SHALL display the Today_Total in the format "今日總計：XXX 元"
2. WHEN the page loads, THE System SHALL calculate and display the sum of all Expense_Entry amounts
3. WHEN a new Expense_Entry is added, THE System SHALL immediately update the Today_Total
4. WHEN an Expense_Entry is deleted, THE System SHALL immediately update the Today_Total
5. WHEN there are no Expense_Entry items, THE System SHALL display "今日總計：0 元"
6. THE Today_Total SHALL be the sum of all expense amounts regardless of category
