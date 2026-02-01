'use client';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  totalUsers: number;
  loading: boolean;
  onConfigClick: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  isOpen,
  onToggle,
  totalUsers,
  loading,
  onConfigClick,
  onLogout,
}: AdminSidebarProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const handleNavClick = (callback: () => void) => {
    callback();
    // 移动端点击后自动关闭侧边栏
    if (isMobile) {
      setTimeout(() => {
        onToggle();
      }, 300);
    }
  };

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={onToggle}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`fixed top-0 h-full bg-gray-50 dark:bg-[#252525] z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 lg:left-12' : '-translate-x-full lg:left-12'
        } w-64`}
      >
        <div className="flex flex-col h-full">
          {/* 顶部标题区域 */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              账号管理
            </h2>
            {/* 移动端关闭按钮 */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 用户总数 */}
          <div className="p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">用户总数</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {loading ? '...' : totalUsers}
              </div>
            </div>
          </div>

          {/* 系统配置按钮 */}
          <div className="p-4">
            <button
              onClick={() => handleNavClick(onConfigClick)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              系统配置
            </button>
          </div>

          {/* 退出登录按钮 */}
          <div className="mt-auto p-4">
            <button
              onClick={() => handleNavClick(onLogout)}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
