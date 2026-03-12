import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import { tokenUtils } from '../utils/token';
import type { User, Pagination } from '../api/types/user';
import { showToast } from '../utils/toast';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('1');
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    tokenUtils.clearAllTokens();
    navigate('/login');
  }, [navigate]);

  // 權限檢查：若沒有 Refresh Token，視為未登入，踢回登入頁
  useEffect(() => {
    if (!tokenUtils.getRefreshToken()) {
      handleLogout();
    }
  }, [handleLogout]);

  const fetchUsers = useCallback(async (page: number) => {
    setFetchingUsers(true);
    try {
      const res = await api.user.getUsers(page, 5); // 固定一頁 5 筆
      setUsers(res.data);
      setPagination(res.pagination);
    } catch (err: unknown) {
      console.error('Fetch users failed:', err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        showToast('憑證已過期，請重新登入', 'warning');
        handleLogout();
      } else {
        // 遇到非 401 錯誤，統一顯示 IT 聯繫訊息，不拋出後端原始錯誤
        showToast('系統發生錯誤，請聯繫 IT 人員。', 'error');
      }
    } finally {
      setFetchingUsers(false);
    }
  }, [handleLogout]);

  // 當 currentPage 改變時自動獲取資料
  useEffect(() => {
    if (tokenUtils.getRefreshToken()) {
      fetchUsers(currentPage);
      setInputPage(currentPage.toString());
    }
  }, [currentPage, fetchUsers]);

  const simulateTokenExpire = () => {
    tokenUtils.clearAccessToken();
    showToast('已清除記憶體中的 Access Token，下次請求將觸發 401 與自動 Refresh。', 'info');
  };

  const simulateApiError = () => {
    // 傳入 page=0 來觸發後端錯誤
    fetchUsers(0);
  };

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.total_pages) {
      setCurrentPage(newPage);
    }
  };

  const handleJumpPage = (e: React.FormEvent | React.FocusEvent) => {
    e.preventDefault();
    if (!pagination) return;

    // 驗證是否為純數字字串
    if (!/^\d+$/.test(inputPage)) {
      setInputPage(currentPage.toString());
      return;
    }

    const pageNum = parseInt(inputPage, 10);
    // 驗證範圍：需大於 0 且小於等於最大頁數 (符合 0-最大頁數 的合理範圍)
    if (pageNum > 0 && pageNum <= pagination.total_pages) {
      setCurrentPage(pageNum);
      // 自動補齊格式（例如輸入 01 會變成 1）
      setInputPage(pageNum.toString());
    } else {
      // 若輸入不合法或超過範圍，恢復為目前頁數
      setInputPage(currentPage.toString());
    }
  };

  return (
    <div className="min-h-screen bg-base-200 sm:p-8">
      <div className="max-w-4xl mx-auto">

        {users.length > 0 ? (
          <div className="bg-base-100 sm:rounded-box sm:shadow-xl overflow-hidden mt-0 sm:mt-4">
            
            {/* Toolbar 區塊 */}
            <div className="p-4 border-b border-base-200 bg-base-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold">使用者列表</h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button 
                  onClick={simulateTokenExpire} 
                  className="btn btn-outline btn-warning btn-sm flex-1 sm:flex-none"
                >
                  模擬 Token 過期
                </button>
                <button 
                  onClick={simulateApiError} 
                  className="btn btn-outline btn-error btn-sm flex-1 sm:flex-none"
                  disabled={fetchingUsers}
                >
                  模擬 API 錯誤
                </button>
                <button 
                  onClick={() => fetchUsers(currentPage)} 
                  className="btn btn-neutral btn-sm flex-1 sm:flex-none"
                  disabled={fetchingUsers}
                >
                  {fetchingUsers && <span className="loading loading-spinner"></span>}
                  重新整理
                </button>
              </div>
            </div>

            <div className="overflow-x-auto relative min-h-[300px]">
              {fetchingUsers && (
                <div className="absolute inset-0 bg-base-100/50 z-10 flex items-center justify-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              )}
              <table className="table table-sm sm:table-md table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>頭像</th>
                    <th>名稱</th>
                    <th>信箱</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="avatar">
                          <div className="w-8 sm:w-10 rounded-full">
                            <img src={user.avatar} alt={user.name} />
                          </div>
                        </div>
                      </td>
                      <td className="font-medium">{user.name}</td>
                      <td className="text-xs sm:text-sm">{user.email}</td>
                      <td>
                        <div className="badge badge-sm sm:badge-md badge-success gap-2">
                          {user.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分頁控制區塊 */}
            {pagination && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-base-200 bg-base-50">
                <span className="text-xs sm:text-sm text-base-content/70">
                  共 {pagination.total} 筆資料
                </span>

                <form onSubmit={handleJumpPage} className="join items-center justify-center w-full sm:w-auto">
                  <button 
                    type="button"
                    className="join-item btn btn-sm sm:btn-md btn-neutral" 
                    disabled={currentPage === 1 || fetchingUsers}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    上一頁
                  </button>

                  {/* 中間顯示目前頁數與輸入框 */}
                  <div className="join-item flex items-center justify-center bg-base-100 px-2 sm:px-3 text-sm h-8 sm:h-12 border border-base-300 focus-within:outline focus-within:outline-2 focus-within:outline-primary/50 focus-within:-outline-offset-1">
                    <span className="mr-1 sm:mr-2 text-base-content/70 hidden md:inline">Page</span>
                    <input 
                      type="number" 
                      min="1" 
                      max={pagination.total_pages}
                      className="input input-ghost input-xs sm:input-sm w-10 sm:w-12 text-center p-0 h-6 sm:h-8 bg-base-200 focus:bg-base-100 focus:outline-none" 
                      value={inputPage}
                      onChange={(e) => setInputPage(e.target.value)}
                      onBlur={handleJumpPage}
                      onFocus={(e) => e.target.select()}
                      disabled={fetchingUsers}
                    />
                    <span className="ml-1 sm:ml-2 text-base-content/70 whitespace-nowrap">/ {pagination.total_pages}</span>
                  </div>

                  <button 
                    type="button"
                    className="join-item btn btn-sm sm:btn-md btn-neutral" 
                    disabled={currentPage === pagination.total_pages || fetchingUsers}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    下一頁
                  </button>

                  {/* 隱藏的 submit 讓 Enter 鍵可以送出表單 */}
                  <button type="submit" className="hidden" disabled={fetchingUsers}>前往</button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-base-100 sm:rounded-box sm:shadow-xl text-base-content/60 mt-0 sm:mt-4">
            {fetchingUsers ? (
               <span className="loading loading-spinner text-primary"></span>
            ) : (
              "目前沒有資料"
            )}
          </div>
        )}
      </div>
    </div>
  );
}

