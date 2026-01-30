import { NextResponse } from 'next/server';
import { checkDatabaseHealth, getEnvStatus } from '../../../lib/db';

/**
 * GET /api/health - 健康检查 API
 * 用于检查数据库连接状态和环境变量配置
 */
export async function GET() {
  try {
    const envStatus = getEnvStatus();
    const dbHealth = await checkDatabaseHealth();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: {
        configured: envStatus.configured,
        missing: envStatus.missing,
        details: envStatus.details,
      },
      database: {
        status: dbHealth.status,
        message: dbHealth.message,
        code: dbHealth.code,
      },
      // 不返回实际的密钥值，只返回是否存在
      envVars: {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
        BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
