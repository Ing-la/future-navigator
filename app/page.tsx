'use client';

import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import LandingPage from './components/landing/LandingPage';
import LoginModal from './components/auth/LoginModal';
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';

export default function Home() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');

  // 如果是管理员，显示管理员界面
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // 如果是教师，显示教师界面
  if (user?.role === 'teacher') {
    return <TeacherDashboard />;
  }

  const handleLoginClick = () => {
    setLoginMode('login');
    setLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setLoginMode('register');
    setLoginModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#1a1a1a] overflow-hidden">
      {/* 左侧固定区域 - 桌面端功能按钮 */}
      <div className="hidden lg:flex fixed top-0 left-0 h-full w-12 bg-gray-50 dark:bg-[#252525] z-50 flex-col items-center pt-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* 侧边栏 */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />

      {/* 设置按钮 - 固定在视口右上角，不受侧边栏影响 */}
      <div className="hidden lg:flex fixed top-0 right-0 z-50 items-center gap-2 p-3">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {(() => {
                const role = user.role as 'teacher' | 'parent' | 'admin' | null;
                return role === 'teacher' ? '教师' : role === 'parent' ? '家长' : role === 'admin' ? '管理员' : '用户';
              })()}（{user.username || ''}）
            </span>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              退出
            </button>
          </div>
        ) : (
          <button
            onClick={handleLoginClick}
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            未登录
          </button>
        )}
      </div>

      {/* 登录弹窗 */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        initialMode={loginMode}
      />

      {/* 主内容区域 - 独立层，占据剩余空间 */}
      <div 
        className={`flex-1 flex flex-col min-w-0 lg:fixed lg:top-0 lg:right-0 lg:bottom-0 transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? 'lg:left-[304px]' // 48px(固定区域) + 256px(侧边栏)
            : 'lg:left-12' // 只有48px固定区域
        }`}
      >
        {/* 顶部栏 */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {/* 移动端功能按钮 */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Future Navigator
            </h1>
          </div>
          
          {/* 移动端设置按钮 */}
          <div className="flex items-center gap-2 lg:hidden">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                未登录
              </button>
            )}
          </div>
        </header>

        {/* 主内容：根据登录状态显示不同内容 */}
        {user ? (
          <ChatWindow />
        ) : (
          <LandingPage 
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
          />
        )}
      </div>
    </div>
  );
}
