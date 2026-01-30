import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, config } = body;

    // 只支持 Gemini 配置测试
    if (type !== 'gemini') {
      return NextResponse.json(
        { success: false, message: '不支持的配置类型' },
        { status: 400 }
      );
    }

    const apiKey = config.apiKey;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'API Key 不能为空' },
        { status: 400 }
      );
    }

    // 测试 Gemini API Key
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        { method: 'GET' }
      );

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Gemini API Key 验证成功',
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { success: false, message: errorData.error?.message || 'API Key 无效或已过期' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Gemini API test error:', error);
      return NextResponse.json(
        { success: false, message: '无法连接到 Gemini API，请检查网络连接' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Config test error:', error);
    return NextResponse.json(
      { success: false, message: '测试失败' },
      { status: 500 }
    );
  }
}
