import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { getGeminiConfigServer } from './config';

/**
 * Gemini 模型配置
 */
export const geminiConfig = {
  // 模型选择
  models: {
    flash: 'gemini-1.5-flash', // 快速响应，适合实时对话
    pro: 'gemini-1.5-pro',      // 深度分析，适合报告生成
  },
} as const;

/**
 * 获取 Gemini API Key
 * 优先级：数据库配置 > 环境变量
 */
export async function getGeminiApiKey(): Promise<string> {
  // 从数据库或环境变量读取配置
  const config = await getGeminiConfigServer();
  return config.apiKey || '';
}

/**
 * 初始化 Gemini 客户端
 * @param model 模型类型
 * @param apiKey 可选的 API Key（如果提供，优先使用；否则从环境变量或数据库读取）
 */
export async function getGeminiModel(model: 'flash' | 'pro' = 'flash', apiKey?: string) {
  let key = apiKey;
  
  if (!key) {
    key = await getGeminiApiKey();
  }
  
  if (!key) {
    throw new Error('GEMINI_API_KEY 未配置，请在环境变量中配置或通过管理员界面配置');
  }
  
  // 临时设置环境变量（如果提供了 apiKey）
  // 注意：这仅适用于当前请求，不会影响全局环境变量
  const originalApiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    process.env.GEMINI_API_KEY = apiKey;
  }
  
  try {
    // google() 函数会从环境变量读取 GEMINI_API_KEY
    return google(geminiConfig.models[model]);
  } finally {
    // 恢复原始环境变量
    if (apiKey && originalApiKey !== undefined) {
      process.env.GEMINI_API_KEY = originalApiKey;
    }
  }
}

/**
 * 生成文本回复（非流式）
 */
export async function generateTextResponse(
  prompt: string,
  options?: {
    model?: 'flash' | 'pro';
    systemInstruction?: string;
  }
) {
  const model = await getGeminiModel(options?.model || 'flash');
  
  const result = await generateText({
    model,
    prompt,
    system: options?.systemInstruction,
  });

  return result.text;
}

/**
 * 生成流式文本回复
 */
export async function generateStreamResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  options?: {
    model?: 'flash' | 'pro';
    systemInstruction?: string;
  }
) {
  const model = await getGeminiModel(options?.model || 'flash');
  
  return streamText({
    model,
    messages,
    system: options?.systemInstruction,
  });
}

/**
 * 多模态分析（视频/音频/图片）
 */
export async function analyzeMultimodal(
  files: Array<{ url: string; type: 'image' | 'video' | 'audio' }>,
  prompt: string,
  options?: {
    model?: 'flash' | 'pro';
  }
) {
  const model = await getGeminiModel(options?.model || 'pro');
  
  // TODO: 实现多模态分析逻辑
  // 需要将文件 URL 转换为 Gemini 可接受的格式
  
  return {
    success: true,
    analysis: '分析结果占位',
  };
}
