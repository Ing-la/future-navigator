'use client';

import { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RadarData {
  language_application: number;
  communication_collaboration: number;
  problem_solving: number;
  proactive_exploration: number;
  creative_expression: number;
  intrinsic_motivation: number;
}

interface RadarChartProps {
  studentId: string;
}

export default function RadarChart({ studentId }: RadarChartProps) {
  const [radarData, setRadarData] = useState<RadarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRadarData();
  }, [studentId]);

  const loadRadarData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/radar/${studentId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setRadarData(result.data);
      } else {
        setError('暂无数据');
      }
    } catch (error: any) {
      console.error('加载雷达图数据失败:', error);
      setError('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !radarData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {error || '暂无数据，上传视频并分析后可查看能力评估'}
          </p>
        </div>
      </div>
    );
  }

  // 转换数据格式供 recharts 使用
  const chartData = [
    {
      subject: '语言应用',
      value: radarData.language_application,
      fullMark: 100,
    },
    {
      subject: '沟通协作',
      value: radarData.communication_collaboration,
      fullMark: 100,
    },
    {
      subject: '问题解决',
      value: radarData.problem_solving,
      fullMark: 100,
    },
    {
      subject: '主动探索',
      value: radarData.proactive_exploration,
      fullMark: 100,
    },
    {
      subject: '创造性表达',
      value: radarData.creative_expression,
      fullMark: 100,
    },
    {
      subject: '学习内驱力',
      value: radarData.intrinsic_motivation,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <RechartsRadarChart data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            className="dark:text-gray-300"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="能力评估"
            dataKey="value"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.6}
          />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        <p>评分范围：0-100，数值越高表示该维度能力越强</p>
      </div>
    </div>
  );
}
