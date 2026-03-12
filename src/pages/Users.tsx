import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import { tokenUtils } from '../utils/token';
import type { User } from '../api/types/user';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
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

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await api.user.getUsers();
      setUsers(res.data);
    } catch (err: unknown) {
      console.error('Fetch users failed:', err);
      // 若攔截器處理失敗 (如 refresh_token 也過期了)，最終會拋 401 錯誤到這裡
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        alert('憑證已過期，請重新登入');
        handleLogout();
      }
    } finally {
      setFetchingUsers(false);
    }
  };

  const simulateTokenExpire = () => {
    tokenUtils.clearAccessToken();
    alert('已清除記憶體中的 Access Token，下次請求將觸發 401 與自動 Refresh。');
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-base-100 p-4 rounded-box shadow-sm">
          <h1 className="text-3xl font-bold">使用者管理</h1>
          <button onClick={handleLogout} className="btn btn-outline btn-error">
            登出
          </button>
        </div>

        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">操作與測試</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              <button 
                onClick={fetchUsers} 
                className="btn btn-primary"
                disabled={fetchingUsers}
              >
                {fetchingUsers && <span className="loading loading-spinner"></span>}
                獲取最新名單
              </button>
              <button 
                onClick={simulateTokenExpire} 
                className="btn btn-warning"
              >
                模擬 Access Token 過期
              </button>
            </div>
          </div>
        </div>

        {users.length > 0 ? (
          <div className="overflow-x-auto bg-base-100 rounded-box shadow-xl">
            <table className="table table-zebra w-full">
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
                        <div className="w-10 rounded-full">
                          <img src={user.avatar} alt={user.name} />
                        </div>
                      </div>
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="badge badge-success gap-2">
                        {user.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-base-100 rounded-box shadow-xl text-base-content/60">
            請點擊「獲取最新名單」來載入資料
          </div>
        )}
      </div>
    </div>
  );
}
