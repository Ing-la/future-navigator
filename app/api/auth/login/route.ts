import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getEnvStatus } from '../../../../lib/db';
import { verifyPassword } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 检查环境变量配置
    const envStatus = getEnvStatus();
    if (!envStatus.configured) {
      console.error('环境变量未配置:', envStatus.missing);
      return NextResponse.json(
        { 
          success: false, 
          message: `数据库未配置: ${envStatus.missing.join(', ')}`,
          details: '请检查 Vercel 环境变量配置',
        },
        { status: 500 }
      );
    }

    if (!supabaseAdmin) {
      console.error('Supabase 管理员客户端初始化失败');
      return NextResponse.json(
        { 
          success: false, 
          message: '数据库连接失败',
          details: 'SUPABASE_SERVICE_ROLE_KEY 未配置或无效',
        },
        { status: 500 }
      );
    }

    // 查询用户
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, username, password_hash, role')
      .eq('username', username)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 未找到用户
        return NextResponse.json(
          { success: false, message: '用户名或密码错误' },
          { status: 401 }
        );
      }
      console.error('登录失败 - 数据库错误:', {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      return NextResponse.json(
        { 
          success: false, 
          message: '数据库查询失败',
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 验证角色（如果提供了角色）
    if (role && user.role !== role) {
      return NextResponse.json(
        { success: false, message: '角色不匹配' },
        { status: 403 }
      );
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 返回用户信息（不包含密码）
    return NextResponse.json({
      success: true,
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('登录错误 - 异常:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { 
        success: false, 
        message: '登录失败',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
