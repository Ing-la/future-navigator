'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'teacher' | 'parent' | 'admin' | null;

export interface User {
  id: string;
  username: string;
  password: string; // 仅前端存储，实际应该不存储密码
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => boolean;
  register: (username: string, password: string, role: UserRole) => boolean;
  loginAsAdmin: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 从 localStorage 恢复登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (username: string, password: string, role: UserRole): boolean => {
    // 从 localStorage 获取用户列表
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      (u: User) => u.username === username && u.password === password && u.role === role
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (username: string, password: string, role: UserRole): boolean => {
    // 从 localStorage 获取用户列表
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 检查用户名是否已存在
    if (users.some((u: User) => u.username === username)) {
      return false;
    }

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // 自动登录
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const loginAsAdmin = () => {
    const adminUser: User = {
      id: 'admin',
      username: '管理员',
      password: '',
      role: 'admin',
    };
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

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
