'use client';

interface OverviewStatsProps {
  totalStudents: number;
  summary: string;
  pendingTasks: number;
}

export default function OverviewStats({ totalStudents, summary, pendingTasks }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 卡片1：总学生数 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">总学生数</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalStudents}
            </div>
          </div>
        </div>
      </div>

      {/* 卡片2：班级摘要 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg flex-shrink-0">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">班级摘要</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {summary}
            </p>
          </div>
        </div>
      </div>

      {/* 卡片3：待处理任务 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-3">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">待处理任务</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {pendingTasks}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              包括待分析的视频和待生成的报告
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
