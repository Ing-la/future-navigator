'use client';

import { useState, useEffect } from 'react';

interface Video {
  id: string;
  blob_url: string;
  title?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  duration_seconds?: number;
  created_at: string;
}

interface VideoListProps {
  studentId: string;
}

export default function VideoList({ studentId }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
    
    // 监听视频上传事件
    const handleVideoUploaded = () => {
      loadVideos();
    };
    window.addEventListener('videoUploaded', handleVideoUploaded);
    
    return () => {
      window.removeEventListener('videoUploaded', handleVideoUploaded);
    };
  }, [studentId]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos?studentId=${studentId}`);
      const result = await response.json();
      
      if (result.success) {
        setVideos(result.data || []);
      }
    } catch (error) {
      console.error('加载视频列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'processing':
        return '分析中';
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        暂无视频
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {video.title || '未命名视频'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(video.created_at).toLocaleString('zh-CN')}
              {video.duration_seconds && ` · ${Math.floor(video.duration_seconds / 60)}:${String(video.duration_seconds % 60).padStart(2, '0')}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(video.status)}`}>
              {getStatusLabel(video.status)}
            </span>
            {video.status === 'completed' && (
              <button
                onClick={() => {
                  // TODO: 查看分析结果
                  alert('查看分析结果功能待实现');
                }}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                查看
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
