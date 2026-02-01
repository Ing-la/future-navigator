import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/db';

/**
 * GET /api/radar/[studentId] - 获取学生的雷达图数据
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;

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

    // 获取最新的雷达图数据（不关联视频的综合评估）
    const { data: radarData, error } = await supabaseAdmin
      .from('student_radar_data')
      .select('*')
      .eq('student_id', studentId)
      .is('video_id', null)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 没有找到数据，返回默认值
        return NextResponse.json({
          success: true,
          data: {
            language_application: 0,
            communication_collaboration: 0,
            problem_solving: 0,
            proactive_exploration: 0,
            creative_expression: 0,
            intrinsic_motivation: 0,
          },
          message: '暂无数据',
        });
      }
      console.error('查询雷达图数据失败:', error);
      return NextResponse.json(
        { success: false, message: '查询雷达图数据失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        language_application: radarData.language_application,
        communication_collaboration: radarData.communication_collaboration,
        problem_solving: radarData.problem_solving,
        proactive_exploration: radarData.proactive_exploration,
        creative_expression: radarData.creative_expression,
        intrinsic_motivation: radarData.intrinsic_motivation,
      },
    });
  } catch (error: any) {
    console.error('获取雷达图数据错误:', error);
    return NextResponse.json(
      { success: false, message: '获取雷达图数据失败', details: error.message },
      { status: 500 }
    );
  }
}
