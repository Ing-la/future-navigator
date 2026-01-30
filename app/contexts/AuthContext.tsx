'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'teacher' | 'parent' | 'admin' | null;

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  register: (username: string, password: string, role: UserRole) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 从 localStorage 恢复登录状态（临时，用于保持会话）
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // 验证用户信息是否有效（可以添加 token 验证）
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        const userData: User = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
        };
        setUser(userData);
        // 保存到 localStorage（用于保持会话）
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        // 抛出错误，包含详细的错误信息
        const errorMessage = data.details 
          ? `${data.message}: ${data.details}` 
          : data.message || '登录失败';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      // 重新抛出错误，让组件可以显示错误信息
      throw error;
    }
  };

  const register = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        const userData: User = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
        };
        setUser(userData);
        // 保存到 localStorage（用于保持会话）
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        // 抛出错误，包含详细的错误信息
        const errorMessage = data.details 
          ? `${data.message}: ${data.details}` 
          : data.message || '注册失败';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('注册失败:', error);
      // 重新抛出错误，让组件可以显示错误信息
      throw error;
    }
  };

  const loginAsAdmin = () => {
    // 管理员登录无需密码，直接设置
    const adminUser: User = {
      id: 'admin',
      username: '管理员',
      role: 'admin',
    };
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 如果正在加载，仍然渲染 children，但 user 为 null
  // 这样可以避免预渲染错误

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginAsAdmin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
