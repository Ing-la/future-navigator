import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/db';

/**
 * GET /api/students/[id]/errors - 获取学生的错误记录
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params;

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: '缺少学生 ID' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    const { data: errors, error } = await supabaseAdmin
      .from('student_errors')
      .select('*')
      .eq('student_id', studentId)
      .order('frequency', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('查询错误记录失败:', error);
      return NextResponse.json(
        { success: false, message: '查询错误记录失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: errors || [],
    });
  } catch (error: any) {
    console.error('获取错误记录错误:', error);
    return NextResponse.json(
      { success: false, message: '获取错误记录失败', details: error.message },
      { status: 500 }
    );
  }
}
