import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getEnvStatus } from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    // 验证输入
    if (!username || !password || !role) {
      return NextResponse.json(
        { success: false, message: '用户名、密码和角色不能为空' },
        { status: 400 }
      );
    }

    // 验证角色
    if (!['teacher', 'parent', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, message: '无效的角色' },
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

    // 检查 Supabase 客户端
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

    // 检查用户名是否已存在
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 表示未找到记录，这是正常的
      console.error('检查用户名失败:', checkError);
      return NextResponse.json(
        { 
          success: false, 
          message: '数据库查询失败',
          details: checkError.message,
        },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '用户名已存在' },
        { status: 400 }
      );
    }

    // 加密密码
    const passwordHash = await hashPassword(password);

    // 创建用户
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        username,
        password_hash: passwordHash,
        role,
      })
      .select('id, username, role, created_at')
      .single();

    if (insertError) {
      console.error('注册失败 - 数据库错误:', {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
      return NextResponse.json(
        { 
          success: false, 
          message: '注册失败',
          details: insertError.message,
          code: insertError.code,
        },
        { status: 500 }
      );
    }

    if (!newUser) {
      console.error('注册失败 - 未返回用户数据');
      return NextResponse.json(
        { 
          success: false, 
          message: '注册失败，用户数据未返回',
        },
        { status: 500 }
      );
    }

    console.log('用户注册成功:', { id: newUser.id, username: newUser.username, role: newUser.role });

    return NextResponse.json({
      success: true,
      message: '注册成功',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('注册错误 - 异常:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { 
        success: false, 
        message: '注册失败',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
