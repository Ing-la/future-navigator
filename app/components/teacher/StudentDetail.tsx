'use client';

import StudentInfo from './StudentInfo';
import RadarChart from './RadarChart';
import VideoUpload from './VideoUpload';
import VideoList from './VideoList';
import ReportList from './ReportList';
import ErrorList from './ErrorList';
import CollapsibleCard from './CollapsibleCard';
import type { Student } from './types';

interface StudentDetailProps {
  student: Student;
  onBack: () => void;
}

export default function StudentDetail({ student, onBack }: StudentDetailProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回班级概况
      </button>

      {/* 学生信息卡片（固定，不可折叠） */}
      <StudentInfo student={student} />

      {/* 能力雷达图卡片（默认展开） */}
      <CollapsibleCard
        title="能力评估"
        defaultExpanded={true}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      >
        <RadarChart studentId={student.id} />
      </CollapsibleCard>

      {/* 视频上传与分析卡片 */}
      <CollapsibleCard
        title="视频分析"
        defaultExpanded={false}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
      >
        <div className="space-y-4">
          <VideoUpload studentId={student.id} />
          <VideoList studentId={student.id} />
        </div>
      </CollapsibleCard>

      {/* 分析报告卡片 */}
      <CollapsibleCard
        title="学习报告"
        defaultExpanded={false}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      >
        <ReportList studentId={student.id} />
      </CollapsibleCard>

      {/* 错误纠正卡片 */}
      <CollapsibleCard
        title="需要纠正的问题"
        defaultExpanded={false}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      >
        <ErrorList studentId={student.id} />
      </CollapsibleCard>
    </div>
  );
}
