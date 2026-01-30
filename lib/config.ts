/**
 * 配置管理工具
 * 从 Supabase 数据库读取配置
 */

export interface GeminiConfig {
  apiKey: string;
  configured: boolean;
}

/**
 * 获取 Gemini 配置（服务端）
 */
export async function getGeminiConfigServer(): Promise<GeminiConfig> {
  // 优先从环境变量读取（用于部署时配置）
  if (process.env.GEMINI_API_KEY) {
    return {
      apiKey: process.env.GEMINI_API_KEY,
      configured: true,
    };
  }

  // 从 Supabase 数据库读取
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/config?provider=gemini`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.config) {
        return {
          apiKey: data.config.apiKey || '',
          configured: !!data.config.apiKey,
        };
      }
    }
  } catch (error) {
    console.error('从数据库读取配置失败:', error);
  }

  return {
    apiKey: '',
    configured: false,
  };
}

/**
 * 获取 Gemini 配置（客户端）
 */
export function getGeminiConfig(): GeminiConfig {
  if (typeof window === 'undefined') {
    // 服务端：返回默认值，实际应该使用 getGeminiConfigServer
    return {
      apiKey: '',
      configured: false,
    };
  }

  // 客户端：从 API 读取（通过 useEffect 调用）
  // 这里返回默认值，实际值由组件通过 API 获取
  return {
    apiKey: '',
    configured: false,
  };
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
 * 更新 Gemini 配置（客户端）
 * 通过 API 保存到数据库
 */
export async function updateGeminiConfig(apiKey: string): Promise<GeminiConfig> {
  if (typeof window === 'undefined') {
    throw new Error('updateGeminiConfig 只能在客户端调用');
  }

  try {
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'gemini',
        apiKey,
      }),
    });

    const data = await response.json();
    if (data.success) {
      return {
        apiKey,
        configured: true,
      };
    } else {
      throw new Error(data.message || '保存配置失败');
    }
  } catch (error: any) {
    console.error('保存配置失败:', error);
    throw error;
  }
}

/**
 * 清除 Gemini 配置
 */
export async function clearGeminiConfig(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('clearGeminiConfig 只能在客户端调用');
  }

  // 通过 API 删除配置（设置为非激活状态）
  try {
    await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'gemini',
        apiKey: '',
      }),
    });
  } catch (error) {
    console.error('清除配置失败:', error);
  }
}
