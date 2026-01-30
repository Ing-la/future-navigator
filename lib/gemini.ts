import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

/**
 * Gemini 模型配置
 * 优先级：数据库配置 > 环境变量
 */
export function getGeminiApiKey(): string {
  // TODO: 从 Supabase 数据库读取配置（优先级最高）
  // const dbConfig = await getConfigFromDatabase();
  // if (dbConfig?.gemini?.apiKey) return dbConfig.gemini.apiKey;
  
  // 使用环境变量（部署时使用）
  return process.env.GEMINI_API_KEY || '';
}

/**
 * Gemini 模型配置
 */
export const geminiConfig = {
  // 模型选择
  models: {
    flash: 'gemini-1.5-flash', // 快速响应，适合实时对话
    pro: 'gemini-1.5-pro',      // 深度分析，适合报告生成
  },
};

/**
 * 初始化 Gemini 客户端
 * @param apiKey 可选的 API Key（如果提供，优先使用；否则从环境变量或数据库读取）
 */
export function getGeminiModel(model: 'flash' | 'pro' = 'flash', apiKey?: string) {
  const key = apiKey || getGeminiApiKey();
  if (!key) {
    throw new Error('GEMINI_API_KEY 未配置，请在环境变量中配置或通过管理员界面配置');
  }
  
  // 使用提供的 API Key 初始化
  return google(geminiConfig.models[model], {
    apiKey: key,
  });
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
  const model = getGeminiModel(options?.model || 'flash');
  
  const result = await generateText({
    model,
    prompt,
    systemInstruction: options?.systemInstruction,
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
  const model = getGeminiModel(options?.model || 'flash');
  
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
  const model = getGeminiModel(options?.model || 'pro');
  
  // TODO: 实现多模态分析逻辑
  // 需要将文件 URL 转换为 Gemini 可接受的格式
  
  return {
    success: true,
    analysis: '分析结果占位',
  };
}
