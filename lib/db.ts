/**
 * Supabase 数据库连接和操作
 */

import { createClient } from '@supabase/supabase-js';

// 获取 Supabase 环境变量（支持多种命名方式）
// 优先级：不带前缀 > 带 NEXT_PUBLIC_ 前缀
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 检查环境变量配置
function checkEnvVars() {
  const missing: string[] = [];
  
  if (!supabaseUrl) {
    missing.push('SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!supabaseAnonKey) {
    missing.push('SUPABASE_ANON_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  if (!supabaseServiceRoleKey) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY');
  }
  
  return {
    configured: missing.length === 0,
    missing,
    details: {
      url: !!supabaseUrl,
      anonKey: !!supabaseAnonKey,
      serviceRoleKey: !!supabaseServiceRoleKey,
    },
  };
}

if (!supabaseUrl || !supabaseAnonKey) {
  const envCheck = checkEnvVars();
  console.warn('Supabase 环境变量未配置:', envCheck.missing.join(', '));
  console.warn('请检查 Vercel 环境变量配置');
}

/**
 * Supabase 客户端（使用 Anon Key，受 RLS 策略限制）
 * 用于客户端和一般服务端操作
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Supabase 管理员客户端（使用 Service Role Key，绕过 RLS）
 * 仅用于服务端管理员操作
 */
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * 获取环境变量配置状态
 */
export function getEnvStatus() {
  return checkEnvVars();
}

/**
 * 数据库表类型定义
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          role: 'teacher' | 'parent' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          role: 'teacher' | 'parent' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          role?: 'teacher' | 'parent' | 'admin';
          updated_at?: string;
        };
      };
      ai_config: {
        Row: {
          id: string;
          provider: string;
          api_key_encrypted: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider?: string;
          api_key_encrypted: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider?: string;
          api_key_encrypted?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}

/**
 * 数据库连接初始化
 */
export async function initDatabase() {
  const envCheck = checkEnvVars();
  if (!envCheck.configured) {
    throw new Error(`Supabase 环境变量未配置: ${envCheck.missing.join(', ')}`);
  }

  if (!supabase) {
    throw new Error('Supabase 客户端初始化失败');
  }

  try {
    // 测试连接
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 表示表不存在，这是正常的
      throw error;
    }
    console.log('Supabase 数据库连接成功');
    return { success: true };
  } catch (error: any) {
    console.error('Supabase 数据库连接失败:', error.message);
    throw error;
  }
}

/**
 * 健康检查
 */
export async function checkDatabaseHealth() {
  const envCheck = checkEnvVars();
  if (!envCheck.configured) {
    return { 
      status: 'error', 
      message: `环境变量未配置: ${envCheck.missing.join(', ')}`,
      envCheck,
    };
  }

  if (!supabase) {
    return { 
      status: 'error', 
      message: 'Supabase 客户端初始化失败',
      envCheck,
    };
  }

  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { 
        status: 'error', 
        message: error.message,
        code: error.code,
        envCheck,
      };
    }
    return { 
      status: 'ok', 
      message: '数据库连接正常',
      envCheck,
    };
  } catch (error: any) {
    return { 
      status: 'error', 
      message: error.message,
      envCheck,
    };
  }
}
