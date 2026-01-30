import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    // TODO: 验证用户凭据（连接数据库）
    // TODO: 生成 JWT token
    // TODO: 返回用户信息和 token

    return NextResponse.json({
      success: true,
      message: '登录成功',
      // user: { ... },
      // token: '...',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '登录失败' },
      { status: 401 }
    );
  }
}
