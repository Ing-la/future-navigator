'use client';

import { useState, useEffect } from 'react';

interface Error {
  id: string;
  error_type: 'grammar' | 'pronunciation' | 'vocabulary' | 'other';
  error_content: string;
  correct_content: string;
  frequency: number;
  context?: string;
}

interface ErrorListProps {
  studentId: string;
}

export default function ErrorList({ studentId }: ErrorListProps) {
  const [errors, setErrors] = useState<Error[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'grammar' | 'pronunciation'>('all');

  useEffect(() => {
    loadErrors();
  }, [studentId]);

  const loadErrors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/students/${studentId}/errors`);
      const result = await response.json();
      
      if (result.success) {
        setErrors(result.data || []);
      }
    } catch (error) {
      console.error('加载错误记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getErrorTypeLabel = (type: string) => {
    switch (type) {
      case 'grammar':
        return '语法错误';
      case 'pronunciation':
        return '发音错误';
      case 'vocabulary':
        return '词汇错误';
      default:
        return '其他错误';
    }
  };

  const filteredErrors = filter === 'all' 
    ? errors 
    : errors.filter(e => e.error_type === filter);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  if (errors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        暂无错误记录
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 筛选按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('grammar')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            filter === 'grammar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          语法错误
        </button>
        <button
          onClick={() => setFilter('pronunciation')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            filter === 'pronunciation'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          发音错误
        </button>
      </div>

      {/* 错误列表 */}
      {filteredErrors.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          该类型暂无错误记录
        </div>
      ) : (
        <div className="space-y-3">
          {filteredErrors.map((error) => (
            <div
              key={error.id}
              className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded">
                  {getErrorTypeLabel(error.error_type)}
                </span>
                {error.frequency > 1 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    出现 {error.frequency} 次
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">错误：</span>
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium ml-1">
                    {error.error_content}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">正确：</span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium ml-1">
                    {error.correct_content}
                  </span>
                </div>
                {error.context && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    上下文：{error.context}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
