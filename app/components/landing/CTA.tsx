'use client';

import { useState } from 'react';

interface CTAProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function CTA({ onLoginClick, onRegisterClick }: CTAProps) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        立即开始使用
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        登录或注册账号，开启智能学习之旅
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onLoginClick}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-lg"
        >
          登录
        </button>
        <button
          onClick={onRegisterClick}
          className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors text-lg"
        >
          注册
        </button>
      </div>
    </div>
  );
}
