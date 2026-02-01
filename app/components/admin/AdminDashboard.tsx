'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import UserList from './UserList';
import ConfigPanel from './ConfigPanel';
import ResetPasswordModal from './ResetPasswordModal';
import type { User } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
        setTotalUsers(data.total || 0);
      }
    } catch (error) {
      console.error('加载用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除该用户吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // 重新加载用户列表
        await loadUsers();
      } else {
        alert('删除用户失败：' + (data.message || '未知错误'));
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      alert('删除用户失败，请稍后重试');
    }
  };

  const handleResetPassword = async (userId: string, newPassword: string) => {
    try {
      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        alert('密码已成功重置');
        setResetPasswordUser(null);
      } else {
        throw new Error(data.message || data.details || '重置密码失败');
      }
    } catch (error: any) {
      console.error('重置密码失败:', error);
      throw error;
    }
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
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        totalUsers={totalUsers}
        loading={loading}
        onConfigClick={() => setShowConfig(true)}
        onLogout={logout}
      />

      {/* 右上角固定区域 */}
      <div className="hidden lg:flex fixed top-0 right-0 z-50 items-center gap-2 p-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            管理员（{user?.username}）
          </span>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            退出
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div
        className={`flex-1 flex flex-col min-w-0 lg:fixed lg:top-0 lg:right-0 lg:bottom-0 transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? 'lg:left-[304px]' // 48px(固定区域) + 256px(侧边栏)
            : 'lg:left-12' // 只有48px固定区域
        }`}
      >
        {/* 顶部栏 */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1a1a1a]">
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
              用户管理
            </h1>
          </div>

          {/* 移动端退出按钮 */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {user?.username}
            </span>
            <button
              onClick={logout}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              退出
            </button>
          </div>
        </header>

        {/* 主内容 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">加载中...</p>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto p-6">
              <UserList 
                users={users} 
                onDelete={handleDeleteUser}
                onResetPassword={setResetPasswordUser}
              />
            </div>
          )}
        </div>
      </div>

      {/* 配置面板 */}
      {showConfig && <ConfigPanel onClose={() => setShowConfig(false)} />}

      {/* 重置密码模态框 */}
      {resetPasswordUser && (
        <ResetPasswordModal
          user={resetPasswordUser}
          onClose={() => setResetPasswordUser(null)}
          onConfirm={handleResetPassword}
        />
      )}
    </div>
  );
}
