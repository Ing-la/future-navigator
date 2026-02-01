'use client';

import type { Student } from './types';

interface TeacherSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  students: Student[];
  selectedStudent: Student | null;
  currentView: 'overview' | 'student-detail';
  onSelectOverview: () => void;
  onSelectStudent: (student: Student) => void;
}

export default function TeacherSidebar({
  isOpen,
  onToggle,
  students,
  selectedStudent,
  currentView,
  onSelectOverview,
  onSelectStudent,
}: TeacherSidebarProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const handleNavClick = (callback: () => void) => {
    callback();
    // 移动端点击后自动关闭侧边栏
    if (isMobile) {
      setTimeout(() => {
        onToggle();
      }, 300);
    }
  };

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={onToggle}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`fixed top-0 h-full bg-gray-50 dark:bg-[#252525] z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 lg:left-12' : '-translate-x-full lg:left-12'
        } w-64`}
      >
        <div className="flex flex-col h-full">
          {/* 顶部标题区域 */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              导航
            </h2>
            {/* 移动端关闭按钮 */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 班级概况按钮 */}
          <div className="p-4">
            <button
              onClick={() => handleNavClick(onSelectOverview)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">班级概况</span>
            </button>
          </div>

          {/* 学生列表 */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              学生列表
            </h3>
            {students.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                暂无学生
              </div>
            ) : (
              <nav className="space-y-1">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleNavClick(() => onSelectStudent(student))}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                      selectedStudent?.id === student.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {student.avatar_url ? (
                      <img
                        src={student.avatar_url}
                        alt={student.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{student.name}</div>
                      {student.student_number && (
                        <div className="text-xs opacity-75 truncate">
                          {student.student_number}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
