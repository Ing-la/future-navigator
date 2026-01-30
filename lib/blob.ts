import { put, list, del } from '@vercel/blob';

/**
 * Vercel Blob 配置
 */
export const blobConfig = {
  token: process.env.BLOB_READ_WRITE_TOKEN || '',
};

/**
 * 上传文件到 Vercel Blob
 */
export async function uploadFile(
  file: File | Buffer,
  filename: string,
  options?: {
    contentType?: string;
    addRandomSuffix?: boolean;
  }
) {
  if (!blobConfig.token) {
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
 */
export async function listFiles(prefix?: string) {
  if (!blobConfig.token) {
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
 */
export async function deleteFile(url: string) {
  if (!blobConfig.token) {
    throw new Error('BLOB_READ_WRITE_TOKEN 未配置');
  }

  await del(url, {
    token: blobConfig.token,
  });

  return { success: true };
}

/**
 * 获取文件的公开 URL
 */
export function getPublicUrl(url: string): string {
  return url;
}
