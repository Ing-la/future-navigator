/**
 * 用户相关类型定义
 */

export type UserRole = 'teacher' | 'parent' | 'admin';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  username: string;
  password: string;
  email?: string;
  role: UserRole;
}

export interface UserLoginInput {
  username: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}
