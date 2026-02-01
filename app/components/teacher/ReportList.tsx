'use client';

import { useState, useEffect } from 'react';

interface Report {
  id: string;
  title?: string;
  report_type: 'single' | 'quarterly' | 'custom';
  summary?: string;
  created_at: string;
}

interface ReportListProps {
  studentId: string;
}

export default function ReportList({ studentId }: ReportListProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReports();
  }, [studentId]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports?studentId=${studentId}`);
      const result = await response.json();
      
      if (result.success) {
        setReports(result.data || []);
      }
    } catch (error) {
      console.error('加载报告列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (type: 'single' | 'quarterly') => {
    try {
      setGenerating(true);
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          reportType: type,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 重新加载报告列表
        await loadReports();
      } else {
        alert('生成报告失败：' + (result.message || '未知错误'));
      }
    } catch (error) {
      console.error('生成报告失败:', error);
      alert('生成报告失败，请稍后重试');
    } finally {
      setGenerating(false);
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'single':
        return '单次分析';
      case 'quarterly':
        return '季度总结';
      case 'custom':
        return '自定义';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 生成报告按钮 */}
      <div className="flex gap-3">
        <button
          onClick={() => handleGenerateReport('single')}
          disabled={generating}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
        >
          {generating ? '生成中...' : '生成单次分析报告'}
        </button>
        <button
          onClick={() => handleGenerateReport('quarterly')}
          disabled={generating}
          className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
        >
          {generating ? '生成中...' : '生成季度总结'}
        </button>
      </div>

      {/* 报告列表 */}
      {reports.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          暂无报告
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => {
                // TODO: 查看报告详情
                alert('查看报告详情功能待实现');
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {report.title || '未命名报告'}
                  </div>
                  {report.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {report.summary}
                    </p>
                  )}
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded ml-2">
                  {getReportTypeLabel(report.report_type)}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(report.created_at).toLocaleString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
