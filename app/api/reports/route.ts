import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/db';

/**
 * GET /api/reports - 获取报告列表
 */
export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');

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

    const { data: reports, error } = await supabaseAdmin
      .from('analysis_reports')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('查询报告列表失败:', error);
      return NextResponse.json(
        { success: false, message: '查询报告列表失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reports || [],
    });
  } catch (error: any) {
    console.error('获取报告列表错误:', error);
    return NextResponse.json(
      { success: false, message: '获取报告列表失败', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reports - 生成分析报告
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, reportType } = body;

    if (!studentId || !reportType) {
      return NextResponse.json(
        { success: false, message: '缺少学生 ID 或报告类型' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    // TODO: 调用 AI 生成报告内容
    // 暂时创建占位报告
    const reportTitle = reportType === 'quarterly' ? '季度总结报告' : '单次分析报告';
    const reportSummary = '报告生成中，AI 分析完成后将更新内容...';

    const { data: report, error } = await supabaseAdmin
      .from('analysis_reports')
      .insert({
        student_id: studentId,
        report_type: reportType,
        title: reportTitle,
        summary: reportSummary,
        content: {
          status: 'generating',
          message: '报告正在生成中',
        },
      })
      .select()
      .single();

    if (error) {
      console.error('创建报告失败:', error);
      return NextResponse.json(
        { success: false, message: '创建报告失败', details: error.message },
        { status: 500 }
      );
    }

    // TODO: 异步调用 AI 生成报告内容并更新

    return NextResponse.json({
      success: true,
      data: report,
      message: '报告已创建，正在生成内容...',
    });
  } catch (error: any) {
    console.error('生成报告错误:', error);
    return NextResponse.json(
      { success: false, message: '生成报告失败', details: error.message },
      { status: 500 }
    );
  }
}
