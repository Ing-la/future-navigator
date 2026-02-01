/**
 * 教师仪表板相关的共享类型定义
 */

export interface Student {
  id: string;
  name: string;
  student_number?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface ClassData {
  id: string;
  name: string;
  description?: string;
}
