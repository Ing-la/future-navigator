/**
 * 配置管理工具
 * 当前使用 localStorage 存储（开发阶段）
 * 后续迁移到 Supabase 数据库时再修改
 */

export interface GeminiConfig {
  apiKey: string;
  configured: boolean;
}

const CONFIG_KEY = 'future_navigator_gemini_config';

/**
 * 获取 Gemini 配置
 */
export function getGeminiConfig(): GeminiConfig {
  if (typeof window === 'undefined') {
    // 服务端：优先使用环境变量
    return {
      apiKey: process.env.GEMINI_API_KEY || '',
      configured: !!process.env.GEMINI_API_KEY,
    };
  }

  // 客户端：从 localStorage 读取
  const stored = localStorage.getItem(CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return getDefaultConfig();
    }
  }
  return getDefaultConfig();
}

/**
 * 获取默认配置
 */
function getDefaultConfig(): GeminiConfig {
  return {
    apiKey: '',
    configured: false,
  };
}

/**
 * 更新 Gemini 配置
 */
export function updateGeminiConfig(apiKey: string): GeminiConfig {
  const config: GeminiConfig = {
    apiKey,
    configured: !!apiKey,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  return config;
}

/**
 * 清除 Gemini 配置
 */
export function clearGeminiConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CONFIG_KEY);
  }
}
