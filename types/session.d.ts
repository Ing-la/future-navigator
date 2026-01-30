/**
 * 学习会话相关类型定义
 */

export interface LearningSession {
  id: string;
  userId: string;
  type: 'workshop' | 'class' | 'individual';
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'cancelled';
  videoUrl?: string;
  audioUrl?: string;
  analysisId?: string;
}

export interface SessionCreateInput {
  userId: string;
  type: 'workshop' | 'class' | 'individual';
}

export interface SessionUpdateInput {
  endTime?: Date;
  status?: 'active' | 'completed' | 'cancelled';
  videoUrl?: string;
  audioUrl?: string;
}
