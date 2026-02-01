'use client';

import { useState, useRef } from 'react';

interface VideoUploadProps {
  studentId: string;
}

export default function VideoUpload({ studentId }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('video/')) {
      setError('请选择视频文件');
      return;
    }

    // 验证文件大小（例如：最大 100MB）
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError('文件大小不能超过 100MB');
      return;
    }

    await uploadVideo(file);
  };

  const uploadVideo = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // 创建 FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', studentId);
      formData.append('title', file.name);

      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // 上传成功，刷新视频列表
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // 触发父组件刷新（通过事件或回调）
        window.dispatchEvent(new CustomEvent('videoUploaded'));
      } else {
        setError(result.message || '上传失败');
      }
    } catch (error: any) {
      console.error('上传视频失败:', error);
      setError('上传失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      uploadVideo(file);
    } else {
      setError('请拖放视频文件');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <svg
          className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          拖放视频文件到这里，或
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            点击选择文件
          </button>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          支持 MP4、MOV 等格式，最大 100MB
        </p>
        {uploading && (
          <div className="mt-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">上传中...</p>
          </div>
        )}
        {error && (
          <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
