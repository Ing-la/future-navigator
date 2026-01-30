import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    // TODO: 验证输入（用户名唯一性、密码强度等）
    // TODO: 创建用户（保存到数据库）
    // TODO: 生成 JWT token
    // TODO: 返回用户信息和 token

    return NextResponse.json({
      success: true,
      message: '注册成功',
      // user: { ... },
      // token: '...',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '注册失败' },
      { status: 400 }
    );
  }
}
