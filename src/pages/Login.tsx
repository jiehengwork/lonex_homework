import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import { tokenUtils } from '../utils/token';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 若已登入，自動導向 users 頁面
  useEffect(() => {
    if (tokenUtils.getRefreshToken()) {
      navigate('/users');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.auth.login({ username, password });
      
      tokenUtils.setAccessToken(res.access_token);
      tokenUtils.setRefreshToken(res.refresh_token);
      
      // 登入成功後跳轉至使用者列表
      navigate('/users');
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

  return (
    <div className="hero min-h-screen bg-base-200 px-4 sm:px-0">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">登入帳號</h1>
        </div>
        <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100">
          <form className="card-body p-6 sm:p-8" onSubmit={handleLogin}>
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
              <div className="alert alert-error shadow-lg mt-4 text-sm p-3">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full"
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
