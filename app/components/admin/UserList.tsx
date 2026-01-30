'use client';

import type { User } from '../../contexts/AuthContext';

interface UserListProps {
  users: User[];
  onDelete: (userId: string) => void;
}

export default function UserList({ users, onDelete }: UserListProps) {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher':
        return '教师';
      case 'parent':
        return '家长';
      default:
        return role;
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">暂无用户</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {user.username}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  角色: {getRoleLabel(user.role || '')}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              密码: {user.password}
            </div>
          </div>
          
          <button
            onClick={() => onDelete(user.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
          >
            删除
          </button>
        </div>
      ))}
    </div>
  );
}
