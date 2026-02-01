'use client';

import type { Student } from './types';

interface StudentInfoProps {
  student: Student;
}

export default function StudentInfo({ student }: StudentInfoProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        {student.avatar_url ? (
          <img
            src={student.avatar_url}
            alt={student.name}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
              {student.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {student.name}
          </h2>
          {student.student_number && (
            <p className="text-gray-500 dark:text-gray-400">
              学号：{student.student_number}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
