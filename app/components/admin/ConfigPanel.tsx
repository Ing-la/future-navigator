'use client';

import { useState, useEffect } from 'react';
import { updateGeminiConfig, type GeminiConfig } from '../../../lib/config';

export default function ConfigPanel({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState<GeminiConfig>({ apiKey: '', configured: false });
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/config?provider=gemini');
      const data = await response.json();

      if (data.success) {
        if (data.config) {
          setConfig({
            apiKey: data.config.apiKey || '',
            configured: data.config.configured || false,
          });
        } else {
          setConfig({ apiKey: '', configured: false });
        }
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config.apiKey.trim()) {
      setTestResult({ success: false, message: 'API Key 不能为空' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // 先测试配置
      const testResponse = await fetch('/api/config/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'gemini', config: { apiKey: config.apiKey } }),
      });

      const testData = await testResponse.json();
      setTestResult(testData);

      if (testData.success) {
        // 测试成功，保存配置到数据库
        await updateGeminiConfig(config.apiKey);
        // 重新加载配置
        await loadConfig();
      }
    } catch (error) {
      setTestResult({ success: false, message: '测试失败，请检查网络连接' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI 模型配置</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500 dark:text-gray-400">加载配置中...</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入 Gemini API Key"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  状态: {config.configured ? '✅ 已配置' : '❌ 未配置'}
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  提示: 配置后可用于调用 Gemini 模型。后续将支持配置其他大模型。
                </p>
              </div>

              {/* 测试结果 */}
              {testResult && (
                <div className={`p-3 rounded-lg ${
                  testResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}>
                  {testResult.success ? '✅' : '❌'} {testResult.message}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            关闭
          </button>
          <button
            onClick={handleSave}
            disabled={testing || loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {testing ? '测试中...' : '测试并保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
