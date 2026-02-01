import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/db';

/**
 * GET /api/students - 获取学生列表
 */
export async function GET(request: NextRequest) {
  try {
    const classId = request.nextUrl.searchParams.get('classId');

    if (!classId) {
      return NextResponse.json(
        { success: false, message: '缺少班级 ID' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    const { data: students, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('查询学生列表失败:', error);
      return NextResponse.json(
        { success: false, message: '查询学生列表失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: students || [],
    });
  } catch (error: any) {
    console.error('获取学生列表错误:', error);
    return NextResponse.json(
      { success: false, message: '获取学生列表失败', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students - 添加新学生
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { classId, name, studentNumber, avatarUrl } = body;

    if (!classId || !name) {
      return NextResponse.json(
        { success: false, message: '班级 ID 和学生姓名不能为空' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    const { data: student, error } = await supabaseAdmin
      .from('students')
      .insert({
        class_id: classId,
        name,
        student_number: studentNumber,
        avatar_url: avatarUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('添加学生失败:', error);
      return NextResponse.json(
        { success: false, message: '添加学生失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    console.error('添加学生错误:', error);
    return NextResponse.json(
      { success: false, message: '添加学生失败', details: error.message },
      { status: 500 }
    );
  }
}
