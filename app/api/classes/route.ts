import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/db';

/**
 * GET /api/classes - 获取教师的班级信息
 */
export async function GET(request: NextRequest) {
  try {
    const teacherId = request.nextUrl.searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json(
        { success: false, message: '缺少教师 ID' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    const { data: classes, error } = await supabaseAdmin
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 没有找到班级，返回 null
        return NextResponse.json({
          success: true,
          data: null,
        });
      }
      console.error('查询班级失败:', error);
      return NextResponse.json(
        { success: false, message: '查询班级失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    console.error('获取班级信息错误:', error);
    return NextResponse.json(
      { success: false, message: '获取班级信息失败', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/classes - 创建新班级
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teacherId, name, description } = body;

    if (!teacherId || !name) {
      return NextResponse.json(
        { success: false, message: '教师 ID 和班级名称不能为空' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    // 检查该教师是否已有班级
    const { data: existingClass } = await supabaseAdmin
      .from('classes')
      .select('id')
      .eq('teacher_id', teacherId)
      .limit(1)
      .single();

    if (existingClass) {
      return NextResponse.json(
        { success: false, message: '该教师已有班级，无法重复创建' },
        { status: 400 }
      );
    }

    const { data: newClass, error } = await supabaseAdmin
      .from('classes')
      .insert({
        teacher_id: teacherId,
        name,
        description: description || null,
      })
      .select()
      .single();

    if (error) {
      console.error('创建班级失败:', error);
      return NextResponse.json(
        { success: false, message: '创建班级失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newClass,
    });
  } catch (error: any) {
    console.error('创建班级错误:', error);
    return NextResponse.json(
      { success: false, message: '创建班级失败', details: error.message },
      { status: 500 }
    );
  }
}
