'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import type { UserRole } from './RoleSelector';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginAsAdmin } = useAuth();
  const [step, setStep] = useState<'select' | 'login' | 'register'>('select');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // 重置状态当弹窗关闭时
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setSelectedRole(null);
    }
  }, [isOpen]);

  // ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'admin') {
      // 管理员直接登录
      loginAsAdmin();
      onClose();
    } else {
      // 教师或家长，进入登录表单
      setSelectedRole(role);
      setStep('login');
    }
  };

  const handleSuccess = () => {
    onClose();
    setStep('select');
    setSelectedRole(null);
  };

  const handleBack = () => {
    setStep('select');
    setSelectedRole(null);
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* 弹窗 */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {step === 'select' ? '选择登录方式' : step === 'login' ? '登录' : '注册'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
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

          {step === 'select' ? (
            <div className="space-y-3">
              <button
                onClick={() => handleRoleSelect('teacher')}
                className="w-full px-4 py-3 rounded-lg text-left transition-colors bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
              >
                教师登录
              </button>
              <button
                onClick={() => handleRoleSelect('parent')}
                className="w-full px-4 py-3 rounded-lg text-left transition-colors bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
              >
                家长登录
              </button>
              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full px-4 py-3 rounded-lg text-left transition-colors bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
              >
                管理员登录
                <span className="block text-xs text-blue-500 dark:text-blue-400 mt-1">
                  （无需密码）
                </span>
              </button>
            </div>
          ) : step === 'login' ? (
            <div>
              {selectedRole && (
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    返回
                  </button>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    当前角色：{selectedRole === 'teacher' ? '教师' : '家长'}
                  </div>
                </div>
              )}
              <LoginForm
                selectedRole={selectedRole}
                onSuccess={handleSuccess}
                onSwitchToRegister={() => setStep('register')}
              />
            </div>
          ) : (
            <div>
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setStep('login')}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  返回登录
                </button>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  注册角色：{selectedRole === 'teacher' ? '教师' : '家长'}
                </div>
              </div>
              <RegisterForm
                selectedRole={selectedRole}
                onSuccess={handleSuccess}
                onSwitchToLogin={() => setStep('login')}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
