import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/config - 获取配置
 * 注意：当前使用 localStorage，服务端无法访问
 * 后续迁移到 Supabase 数据库后，可以从数据库读取
 */
export async function GET() {
  // TODO: 从 Supabase 数据库读取配置
  // 当前返回提示
  return NextResponse.json({
    message: '配置获取功能待实现（需要从 Supabase 数据库读取）',
    // 实际应该返回配置信息
  });
}

/**
 * POST /api/config - 更新配置
 * 后续迁移到 Supabase 数据库后，保存到数据库
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, config } = body;

    // TODO: 验证管理员权限
    // TODO: 保存配置到 Supabase 数据库（加密存储）
    // 当前使用 localStorage，由前端直接处理

    return NextResponse.json({
      success: true,
      message: '配置已保存（当前使用 localStorage，部署后将保存到 Supabase 数据库）',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '配置保存失败' },
      { status: 500 }
    );
  }
}
