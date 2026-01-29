'use client';

import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
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
              对话历史
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

          {/* 新建对话按钮 */}
          <div className="p-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                新建对话
              </span>
            </button>
          </div>

          {/* 对话历史列表（占位） */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              暂无对话历史
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
