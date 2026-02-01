'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TeacherSidebar from './TeacherSidebar';
import ClassOverview from './ClassOverview';
import StudentDetail from './StudentDetail';
import type { Student, ClassData } from './types';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'student-detail'>('overview');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);

  // 加载班级和学生数据
  useEffect(() => {
    if (user?.id) {
      loadClassData();
    }
  }, [user]);

  // 监听学生添加事件，刷新学生列表
  useEffect(() => {
    const handleRefresh = () => {
      if (classData?.id) {
        loadStudents();
      }
    };
    window.addEventListener('refreshStudents', handleRefresh);
    return () => window.removeEventListener('refreshStudents', handleRefresh);
  }, [classData]);

  const loadClassData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // 获取班级信息
      const classResponse = await fetch(`/api/classes?teacherId=${user.id}`);
      if (!classResponse.ok) {
        throw new Error(`HTTP error! status: ${classResponse.status}`);
      }
      const classResult = await classResponse.json();
      
      if (classResult.success) {
        if (classResult.data) {
          setClassData(classResult.data);
          // 加载学生列表
          await loadStudents(classResult.data.id);
        } else {
          // 没有班级，创建默认班级
          const createResponse = await fetch('/api/classes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              teacherId: user.id,
              name: '我的班级',
            }),
          });
          if (createResponse.ok) {
            const createResult = await createResponse.json();
            if (createResult.success) {
              setClassData(createResult.data);
              setStudents([]);
            }
          }
        }
      } else {
        console.error('获取班级信息失败:', classResult.message);
      }
    } catch (error) {
      console.error('加载班级数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (classId?: string) => {
    const targetClassId = classId || classData?.id;
    if (!targetClassId) return;

    try {
      const studentsResponse = await fetch(`/api/students?classId=${targetClassId}`);
      if (studentsResponse.ok) {
        const studentsResult = await studentsResponse.json();
        if (studentsResult.success) {
          setStudents(studentsResult.data || []);
        }
      }
    } catch (error) {
      console.error('加载学生列表失败:', error);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('student-detail');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedStudent(null);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#1a1a1a] overflow-hidden">
      {/* 左侧固定区域 - 桌面端功能按钮 */}
      <div className="hidden lg:flex fixed top-0 left-0 h-full w-12 bg-gray-50 dark:bg-[#252525] z-50 flex-col items-center pt-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* 侧边栏 */}
      <TeacherSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        students={students}
        selectedStudent={selectedStudent}
        currentView={currentView}
        onSelectOverview={() => handleBackToOverview()}
        onSelectStudent={handleSelectStudent}
      />

      {/* 右上角固定区域 */}
      <div className="hidden lg:flex fixed top-0 right-0 z-50 items-center gap-2 p-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            教师（{user?.username}）
          </span>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            退出
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div
        className={`flex-1 flex flex-col min-w-0 lg:fixed lg:top-0 lg:right-0 lg:bottom-0 transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? 'lg:left-[304px]' // 48px(固定区域) + 256px(侧边栏)
            : 'lg:left-12' // 只有48px固定区域
        }`}
      >
        {/* 顶部栏 */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            {/* 移动端功能按钮 */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {currentView === 'overview' ? (classData?.name || '班级概况') : selectedStudent?.name || '学生详情'}
            </h1>
          </div>

          {/* 移动端退出按钮 */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {user?.username}
            </span>
            <button
              onClick={logout}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              退出
            </button>
          </div>
        </header>

        {/* 主内容 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">加载中...</p>
              </div>
            </div>
          ) : currentView === 'overview' ? (
            <ClassOverview
              classData={classData}
              students={students}
              onSelectStudent={handleSelectStudent}
            />
          ) : selectedStudent ? (
            <StudentDetail
              student={selectedStudent}
              onBack={handleBackToOverview}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
