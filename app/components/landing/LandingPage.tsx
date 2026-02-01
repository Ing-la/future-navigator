'use client';

import { useState, useEffect } from 'react';
import Hero from './Hero';
import ValueProposition from './ValueProposition';
import FeatureList from './FeatureList';
import CTA from './CTA';

interface LandingPageProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 模拟加载，实际可以用于检查数据或配置
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            加载失败
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 300);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero 区域 */}
      <div id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Hero />
      </div>

      {/* 核心价值主张 */}
      <div id="value-proposition" className="py-20 px-4 bg-white dark:bg-[#1a1a1a]">
        <ValueProposition />
      </div>

      {/* 主要功能 */}
      <div id="features" className="py-20 px-4 bg-gray-50 dark:bg-[#252525]">
        <FeatureList />
      </div>

      {/* CTA 区域 */}
      <div id="cta" className="py-20 px-4 bg-white dark:bg-[#1a1a1a]">
        <CTA onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
      </div>
    </div>
  );
}

// 导出滚动函数供侧边栏使用
export const scrollToHero = () => {
  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const scrollToValueProposition = () => {
  document.getElementById('value-proposition')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const scrollToCTA = () => {
  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
