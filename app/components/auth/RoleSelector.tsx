'use client';

export type UserRole = 'teacher' | 'parent' | 'admin';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
}

export default function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  const roles: { value: UserRole; label: string }[] = [
    { value: 'teacher', label: '教师登录' },
    { value: 'parent', label: '家长登录' },
    { value: 'admin', label: '管理员登录' },
  ];

  return (
    <div className="flex flex-col gap-2 mb-6">
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => onRoleSelect(role.value)}
          className={`px-4 py-3 rounded-lg text-left transition-colors ${
            selectedRole === role.value
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}
