import { useState, useEffect } from 'react';
import axios from 'axios';
import api from './api';
import { tokenUtils } from './utils/token';
import type { User } from './api/types/user';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [users, setUsers] = useState<User[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // 初始化時檢查是否有 refresh_token，如果有可以試著自動登入或至少顯示已登入狀態
  // 實務上可能會呼叫一個 /me API，但這裡我們透過 getUsers 測試
  useEffect(() => {
    if (tokenUtils.getRefreshToken()) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.auth.login({ username, password });
      
      // 依據提案策略儲存 Token
      tokenUtils.setAccessToken(res.access_token);
      tokenUtils.setRefreshToken(res.refresh_token);
      
      setIsLoggedIn(true);
      // 清空表單
      setUsername('');
      setPassword('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '登入失敗，請檢查帳號密碼。');
      } else {
        setError('發生未知的錯誤。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenUtils.clearAllTokens();
    setIsLoggedIn(false);
    setUsers([]);
  };

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await api.user.getUsers();
      setUsers(res.data);
    } catch (err: unknown) {
      console.error('Fetch users failed:', err);
      // 如果 interceptor 處理 refresh 失敗，最終會拋出錯誤到這裡
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleLogout();
        alert('請重新登入');
      }
    } finally {
      setFetchingUsers(false);
    }
  };

  // 測試按鈕：模擬 Access Token 過期 (直接從記憶體清空)
  const simulateTokenExpire = () => {
    tokenUtils.clearAccessToken();
    alert('已清除記憶體中的 Access Token，下次請求將觸發 401 與自動 Refresh。');
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-base-200 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">控制台</h1>
            <button onClick={handleLogout} className="btn btn-outline btn-error">
              登出
            </button>
          </div>

          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title">操作</h2>
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={fetchUsers} 
                  className="btn btn-primary"
                  disabled={fetchingUsers}
                >
                  {fetchingUsers && <span className="loading loading-spinner"></span>}
                  獲取使用者列表
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

          {users.length > 0 && (
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
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-4xl">
        <div className="text-center lg:text-left lg:ml-10">
          <h1 className="text-5xl font-bold">馬上登入</h1>
          <p className="py-6">體驗更安全的混合式 Token 管理架構，擁有自動無感刷新 Access Token 的能力。</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">帳號 (Username)</span>
              </label>
              <input 
                type="text" 
                placeholder="輸入 admin" 
                className="input input-bordered" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">密碼 (Password)</span>
              </label>
              <input 
                type="password" 
                placeholder="輸入 password123" 
                className="input input-bordered" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            {error && (
              <div className="alert alert-error shadow-lg mt-4 text-sm p-2">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner"></span>}
                登入
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
