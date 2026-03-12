import { Link } from 'react-router-dom';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Offline' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-12 px-4 relative">
      <div className="max-w-4xl w-full text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">歡迎來到系統管理後台</h1>
        <p className="text-lg">探索最安全的權限管理與自動 Token 刷新體驗</p>
      </div>

      {/* 模糊的假資料區塊 */}
      <div className="max-w-4xl w-full relative rounded-box overflow-hidden bg-base-100 shadow-xl">
        {/* 遮罩與登入提示 */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base-100/70 backdrop-blur-sm">
          <div className="bg-base-100 p-8 rounded-xl shadow-2xl text-center border border-base-300">
            <h2 className="text-2xl font-bold mb-2">需要登入</h2>
            <p className="mb-6 text-base-content/70">請登入以查看完整的使用者列表與詳細資訊</p>
            <Link to="/login" className="btn btn-primary btn-lg">
              前往登入
            </Link>
          </div>
        </div>

        {/* 背景的假表格 (無法被點擊) */}
        <div className="overflow-x-auto select-none pointer-events-none p-4 opacity-50">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>名稱</th>
                <th>信箱</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="badge badge-ghost gap-2">{user.status}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
