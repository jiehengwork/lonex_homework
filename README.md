# System Admin Dashboard

本專案是一個具備高安全性與流暢使用者體驗的 React 管理後台。

## 🚀 核心功能與實現方法

### 1. API 模組化 (Axios)
* **實現**：建立 `src/api`，將請求依功能分組 (`auth`, `user`)，並嚴格定義 TypeScript 介面。

### 2. 高安全性 Token 與無感刷新 (Silent Refresh)
* **實現**：
  * **混合儲存**：`Access Token` 存於記憶體防 XSS；`Refresh Token` 存於 `LocalStorage` 維持登入。
  * **Axios 攔截器**：攔截 `401` 錯誤，暫停 API 佇列，發送 Refresh 取得新 Token 後自動重發失敗的請求，使用者完全無感。

### 3. 路由系統與權限守衛 (React Router)
* **實現**：建立首頁、登入頁與受保護的使用者頁面。若無 Token 則自動踢回登入頁。

### 4. 列表分頁與精確跳轉
* **實現**：
  * 透過 React 狀態控制 `currentPage`，自動觸發 API 獲取資料。
  * 分頁列包含輸入框，支援「點擊自動全選」與「嚴格數字範圍驗證」，防範無效輸入。

### 5. 全局 Toast 通知與錯誤遮蔽
* **實現**：
  * 使用 `CustomEvent` 實作跨元件的 Toast，免去 Context 設定。
  * **安全防護**：攔截後端非 401 錯誤（如 500），隱藏原始錯誤訊息，統一拋出「系統發生錯誤，請聯繫 IT 人員」。

### 6. 光暗模式切換 (Theme Toggle)
* **實現**：在 Navbar 加入切換按鈕，修改 `<html>` 的 `data-theme` 屬性，並將偏好存入 `localStorage`。

### 7. RWD 響應式佈局
* **實現**：利用 Tailwind CSS 斷點。手機版取消外框留白讓列表滿版顯示，並將操作按鈕與分頁控制改為自動換行或堆疊，確保不破版。

### 8. 嚴格 TypeScript 型別
* **實現**：零 `any` 使用。全面採用 `unknown`，並透過 `axios.isAxiosError(err)` 安全收窄錯誤型別。

### 9. 測試用功能
* **實現**：
  * **模擬 Token 過期**：清空記憶體 Token，測試 401 自動刷新。
  * **模擬 API 錯誤**：發送無效的 `page=0` 參數，測試系統防呆與 Toast 提示機制。

### 10. Gemini Skills 整合
* **實現**：導入了 Gemini CLI Skills 功能（如 `ts-enforcer` 等），確保在開發過程中由 AI 助理輔助嚴格把關 TypeScript 規範與程式碼品質。

