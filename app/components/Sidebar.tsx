'use client';

import { useAuth } from '../contexts/AuthContext';
import { scrollToValueProposition, scrollToFeatures, scrollToCTA } from './landing/LandingPage';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Sidebar({ isOpen, onToggle, onLoginClick, onRegisterClick }: SidebarProps) {
  const { user } = useAuth();

  const handleNavClick = (scrollFn: () => void) => {
    scrollFn();
    // 移动端滚动后自动关闭侧边栏（使用 CSS 类判断）
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        onToggle();
      }, 300);
    }
  };

  // 未登录状态：显示登录入口和导航菜单
  if (!user) {
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
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                欢迎使用
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

            {/* 登录/注册入口 */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <button
                  onClick={onLoginClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  登录
                </button>
                <button
                  onClick={onRegisterClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  注册
                </button>
              </div>
            </div>

            {/* 导航菜单 */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                了解平台
              </h3>
              <nav className="space-y-2">
                <button
                  onClick={() => handleNavClick(scrollToValueProposition)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>核心价值</span>
                </button>
                <button
                  onClick={() => handleNavClick(scrollToFeatures)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>主要功能</span>
                </button>
                <button
                  onClick={() => handleNavClick(scrollToCTA)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span>开始使用</span>
                </button>
              </nav>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // 已登录状态：显示对话历史（保持原有功能）
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
              对话历史
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

          {/* 新建对话按钮 */}
          <div className="p-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                新建对话
              </span>
            </button>
          </div>

          {/* 对话历史列表（占位） */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              暂无对话历史
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
