import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/db';

/**
 * GET /api/class/overview - 获取班级概况数据
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

    // 1. 获取总学生数
    const { count: totalStudents, error: studentsError } = await supabaseAdmin
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId);

    if (studentsError) {
      console.error('查询学生数失败:', studentsError);
    }

    // 2. 获取最新班级摘要
    const { data: summaries, error: summariesError } = await supabaseAdmin
      .from('class_summaries')
      .select('summary_content, generated_at')
      .eq('class_id', classId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (summariesError && summariesError.code !== 'PGRST116') {
      console.error('查询班级摘要失败:', summariesError);
    }

    // 3. 获取待处理任务数
    // 3.1 待分析的视频数
    // 先获取学生 ID 列表
    const { data: students } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('class_id', classId);

    const studentIds = students?.map(s => s.id) || [];
    
    const { count: pendingVideosCount } = studentIds.length > 0
      ? await supabaseAdmin
          .from('videos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .in('student_id', studentIds)
      : { count: 0 };

    // 3.2 待生成的报告数（暂时设为 0，后续实现）
    const pendingReports = 0;

    const pendingTasks = (pendingVideosCount || 0) + pendingReports;

    return NextResponse.json({
      success: true,
      data: {
        totalStudents: totalStudents || 0,
        summary: summaries?.summary_content || '暂无摘要，AI 将定期生成班级摘要',
        pendingTasks,
      },
    });
  } catch (error: any) {
    console.error('获取班级概况错误:', error);
    return NextResponse.json(
      { success: false, message: '获取班级概况失败', details: error.message },
      { status: 500 }
    );
  }
}
