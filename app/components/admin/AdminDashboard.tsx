'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserList from './UserList';
import ConfigPanel from './ConfigPanel';
import ResetPasswordModal from './ResetPasswordModal';
import type { User } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="flex h-screen bg-white dark:bg-[#1a1a1a]">
      {/* 侧边栏 */}
      <aside className="w-64 bg-gray-50 dark:bg-[#252525] border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">账号管理</h2>
        </div>
        
        <div className="flex-1 p-4 space-y-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">用户总数</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {loading ? '...' : totalUsers}
            </div>
          </div>
          
          <button
            onClick={() => setShowConfig(true)}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            系统配置
          </button>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">用户管理</h1>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 dark:text-gray-400">加载中...</div>
            </div>
          ) : (
            <UserList 
              users={users} 
              onDelete={handleDeleteUser}
              onResetPassword={setResetPasswordUser}
            />
          )}
        </div>
      </main>

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
