import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/db';

/**
 * GET /api/users - 获取用户列表
 */
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    // 获取所有非管理员用户
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, username, role, created_at')
      .neq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取用户列表失败:', error);
      return NextResponse.json(
        { success: false, message: '获取用户列表失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      total: users?.length || 0,
    });
  } catch (error: any) {
    console.error('获取用户列表错误:', error);
    return NextResponse.json(
      { success: false, message: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users - 删除用户
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: '用户 ID 不能为空' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    // 删除用户
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('删除用户失败:', error);
      return NextResponse.json(
        { success: false, message: '删除用户失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '用户已删除',
    });
  } catch (error: any) {
    console.error('删除用户错误:', error);
    return NextResponse.json(
      { success: false, message: '删除用户失败' },
      { status: 500 }
    );
  }
}
