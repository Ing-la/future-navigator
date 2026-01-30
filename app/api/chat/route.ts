import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { getGeminiModel } from '../../../lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { messages, apiKey } = await request.json();

    // TODO: 验证用户身份（从 token 获取用户信息）
    
    // 使用配置的 API Key（优先级：请求中的 apiKey > 环境变量）
    const model = getGeminiModel('flash', apiKey);

    // 调用 Gemini API 生成流式回复
    const result = await streamText({
      model,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // 如果是 API Key 未配置错误，返回友好提示
    if (error.message?.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'AI 服务未配置，请联系管理员配置 Gemini API Key' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'AI 服务暂时不可用' },
      { status: 500 }
    );
  }
}
