import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';

/**
 * PUT /api/users/password - 更新用户密码
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, newPassword } = body;

    // 验证输入
    if (!userId || !newPassword) {
      return NextResponse.json(
        { success: false, message: '用户 ID 和新密码不能为空' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: '密码长度至少6位' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    // 检查用户是否存在
    const { data: user, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id, username')
      .eq('id', userId)
      .single();

    if (checkError || !user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 加密新密码
    const passwordHash = await hashPassword(newPassword);

    // 更新密码
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        password_hash: passwordHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('更新密码失败:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          message: '更新密码失败',
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    console.log('密码更新成功:', { userId, username: user.username });

    return NextResponse.json({
      success: true,
      message: '密码已更新',
    });
  } catch (error: any) {
    console.error('更新密码错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '更新密码失败',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
