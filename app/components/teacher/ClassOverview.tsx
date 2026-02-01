'use client';

import { useState, useEffect } from 'react';
import OverviewStats from './OverviewStats';
import StudentList from './StudentList';
import type { Student, ClassData } from './types';

interface ClassOverviewProps {
  classData: ClassData | null;
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

interface OverviewData {
  totalStudents: number;
  summary: string;
  pendingTasks: number;
}

export default function ClassOverview({ classData, students, onSelectStudent }: ClassOverviewProps) {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (classData?.id) {
      loadOverviewData();
    }
  }, [classData]);

  const loadOverviewData = async () => {
    if (!classData?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/class/overview?classId=${classData.id}`);
      const result = await response.json();
      
      if (result.success) {
        setOverviewData(result.data);
      } else {
        setError(result.message || '加载数据失败');
      }
    } catch (error: any) {
      console.error('加载班级概况失败:', error);
      setError('加载数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            加载失败
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadOverviewData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* 统计卡片 */}
      <OverviewStats
        totalStudents={overviewData?.totalStudents || students.length}
        summary={overviewData?.summary || '暂无摘要'}
        pendingTasks={overviewData?.pendingTasks || 0}
      />

      {/* 学生列表 */}
      <StudentList
        students={students}
        onSelectStudent={onSelectStudent}
        classId={classData?.id || ''}
        onStudentAdded={() => {
          // 触发父组件刷新学生列表
          window.dispatchEvent(new CustomEvent('refreshStudents'));
        }}
      />
    </div>
  );
}
