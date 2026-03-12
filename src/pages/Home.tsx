import { Link } from 'react-router-dom';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Offline' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl w-full text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">歡迎來到系統管理後台</h1>
        <p className="text-base sm:text-lg lg:text-xl px-4">探索最安全的權限管理與自動 Token 刷新體驗</p>
      </div>

      {/* 模糊的假資料區塊 */}
      <div className="max-w-4xl w-full relative rounded-box overflow-hidden bg-base-100 shadow-xl">
        {/* 遮罩與登入提示 */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base-100/70 backdrop-blur-sm p-4">
          <div className="bg-base-100 p-6 sm:p-8 rounded-xl shadow-2xl text-center border border-base-300 w-full max-w-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">需要登入</h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-base-content/70">請登入以查看完整的使用者列表與詳細資訊</p>
            <Link to="/login" className="btn btn-primary w-full sm:w-auto">
              前往登入
            </Link>
          </div>
        </div>

        {/* 背景的假表格 (無法被點擊) */}
        <div className="overflow-x-auto select-none pointer-events-none p-2 sm:p-4 opacity-50">
          <table className="table table-sm sm:table-md table-zebra w-full min-w-[500px]">
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
                  <td className="truncate max-w-[150px] sm:max-w-none">{user.email}</td>
                  <td>
                    <div className="badge badge-sm sm:badge-md badge-ghost gap-2">{user.status}</div>
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
