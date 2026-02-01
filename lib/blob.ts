import { put, list, del, head } from '@vercel/blob';

/**
 * Vercel Blob 配置
 */
export const blobConfig = {
  token: process.env.BLOB_READ_WRITE_TOKEN || '',
};

/**
 * 检查 Blob 配置是否可用
 */
export function isBlobConfigured(): boolean {
  return !!blobConfig.token;
}

/**
 * 上传文件到 Vercel Blob
 * @param file 文件对象（File 或 Buffer）
 * @param filename 文件名（可包含路径，如 'videos/student-123/video.mp4'）
 * @param options 可选配置
 */
export async function uploadFile(
  file: File | Buffer,
  filename: string,
  options?: {
    contentType?: string;
    addRandomSuffix?: boolean;
  }
) {
  if (!isBlobConfigured()) {
    throw new Error('BLOB_READ_WRITE_TOKEN 未配置');
  }

  const blob = await put(filename, file, {
    access: 'public',
    token: blobConfig.token,
    contentType: options?.contentType,
    addRandomSuffix: options?.addRandomSuffix ?? true,
  });

  return blob;
}

/**
 * 列出 Blob 中的文件
 * @param prefix 文件路径前缀（如 'videos/student-123/'）
 */
export async function listFiles(prefix?: string) {
  if (!isBlobConfigured()) {
    throw new Error('BLOB_READ_WRITE_TOKEN 未配置');
  }

  const { blobs } = await list({
    prefix,
    token: blobConfig.token,
  });

  return blobs;
}

/**
 * 删除 Blob 中的文件
 * @param url 文件的完整 URL
 */
export async function deleteFile(url: string) {
  if (!isBlobConfigured()) {
    throw new Error('BLOB_READ_WRITE_TOKEN 未配置');
  }

  await del(url, {
    token: blobConfig.token,
  });

  return { success: true };
}

/**
 * 获取文件信息
 * @param url 文件的完整 URL
 */
export async function getFileInfo(url: string) {
  if (!isBlobConfigured()) {
    throw new Error('BLOB_READ_WRITE_TOKEN 未配置');
  }

  const blob = await head(url, {
    token: blobConfig.token,
  });

  return blob;
}

/**
 * 获取文件的公开 URL
 * Blob 文件默认是公开的，直接返回 URL
 */
export function getPublicUrl(url: string): string {
  return url;
}
