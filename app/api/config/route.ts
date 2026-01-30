import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/db';

/**
 * GET /api/config - 获取配置
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'gemini';

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    // 从数据库读取配置
    const { data: config, error } = await supabaseAdmin
      .from('ai_config')
      .select('id, provider, api_key_encrypted, is_active')
      .eq('provider', provider)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 表示未找到记录
      console.error('获取配置失败:', error);
      return NextResponse.json(
        { success: false, message: '获取配置失败' },
        { status: 500 }
      );
    }

    if (!config) {
      return NextResponse.json({
        success: true,
        config: null,
        configured: false,
      });
    }

    // 解码 API Key（Base64）
    let apiKey = '';
    try {
      apiKey = Buffer.from(config.api_key_encrypted, 'base64').toString('utf-8');
    } catch (e) {
      console.error('解码 API Key 失败:', e);
    }

    return NextResponse.json({
      success: true,
      config: {
        id: config.id,
        provider: config.provider,
        apiKey,
        configured: !!apiKey,
      },
      configured: !!apiKey,
    });
  } catch (error: any) {
    console.error('获取配置错误:', error);
    return NextResponse.json(
      { success: false, message: '获取配置失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/config - 保存配置
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider = 'gemini', apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'API Key 不能为空' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: '数据库未配置' },
        { status: 500 }
      );
    }

    // 编码 API Key（Base64）
    const apiKeyEncrypted = Buffer.from(apiKey).toString('base64');

    // 检查配置是否已存在
    const { data: existingConfig } = await supabaseAdmin
      .from('ai_config')
      .select('id')
      .eq('provider', provider)
      .single();

    let result;
    if (existingConfig) {
      // 更新现有配置
      const { data, error } = await supabaseAdmin
        .from('ai_config')
        .update({
          api_key_encrypted: apiKeyEncrypted,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingConfig.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      result = data;
    } else {
      // 创建新配置
      const { data, error } = await supabaseAdmin
        .from('ai_config')
        .insert({
          provider,
          api_key_encrypted: apiKeyEncrypted,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      result = data;
    }

    return NextResponse.json({
      success: true,
      message: '配置已保存',
      config: {
        id: result.id,
        provider: result.provider,
        configured: true,
      },
    });
  } catch (error: any) {
    console.error('保存配置错误:', error);
    return NextResponse.json(
      { success: false, message: '保存配置失败' },
      { status: 500 }
    );
  }
}
