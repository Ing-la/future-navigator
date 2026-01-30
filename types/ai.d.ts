/**
 * AI 相关类型定义
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  sessionId?: string;
}

export interface AnalyzeRequest {
  videoUrl?: string;
  audioUrl?: string;
  imageUrl?: string;
  sessionId: string;
  userId: string;
}

export interface AnalyzeResponse {
  success: boolean;
  taskId?: string;
  status: 'processing' | 'completed' | 'failed';
  result?: AnalysisResult;
}

export interface AnalysisResult {
  phoneticAccuracy?: number;
  vocabularyDensity?: number;
  teamworkScore?: number;
  safetyAlerts?: SafetyAlert[];
  highlights?: Highlight[];
  competencyRadar?: CompetencyRadar;
}

export interface SafetyAlert {
  type: 'danger' | 'warning';
  message: string;
  timestamp: Date;
  location?: string;
}

export interface Highlight {
  type: 'pronunciation' | 'collaboration' | 'leadership';
  description: string;
  timestamp: Date;
}

export interface CompetencyRadar {
  phonetic: number;      // 0-100
  vocabulary: number;    // 0-100
  teamwork: number;      // 0-100
  leadership: number;    // 0-100
}
