# Vercel Blob 配置指南

## 📋 概述

Vercel Blob 用于存储非结构化数据，如视频文件、图片等。本文档说明如何配置和使用 Vercel Blob。

## 🔧 配置步骤

### 1. 在 Vercel 中创建 Blob Storage

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 `future-navigator`
3. 进入 **Storage** 标签页
4. 点击 **Create Database** 或 **Add Storage**
5. 选择 **Blob** 类型
6. 创建 Blob Storage（Vercel 会自动生成 `BLOB_READ_WRITE_TOKEN`）

### 2. 获取环境变量

创建 Blob Storage 后，Vercel 会自动添加以下环境变量：
- `BLOB_READ_WRITE_TOKEN` - Blob 读写令牌

### 3. 同步环境变量到本地

**方法 A：使用 Vercel CLI（推荐）**

```bash
# 拉取最新的环境变量（包括 Blob Token）
vercel env pull .env.local
```

**方法 B：手动配置**

1. 在 Vercel Dashboard 中，进入项目设置 → **Environment Variables**
2. 找到 `BLOB_READ_WRITE_TOKEN`
3. 复制值到本地 `.env.local` 文件

### 4. 验证配置

检查 `.env.local` 文件是否包含：

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxx
```

## 📦 已安装的依赖

项目已安装 `@vercel/blob` 包，无需额外安装。

## 🛠️ 使用方式

### 上传文件

```typescript
import { uploadFile } from '@/lib/blob';

// 上传视频文件
const file = new File([...], 'video.mp4', { type: 'video/mp4' });
const blob = await uploadFile(file, `videos/student-${studentId}/${filename}.mp4`, {
  contentType: 'video/mp4',
  addRandomSuffix: true, // 自动添加随机后缀避免文件名冲突
});

// blob.url 就是文件的公开 URL，可以存储到数据库
console.log(blob.url);
```

### 删除文件

```typescript
import { deleteFile } from '@/lib/blob';

// 删除文件
await deleteFile(blobUrl);
```

### 列出文件

```typescript
import { listFiles } from '@/lib/blob';

// 列出某个学生的所有视频
const files = await listFiles(`videos/student-${studentId}/`);
```

## 📁 文件路径建议

建议使用以下路径结构：

```
videos/
  └── student-{studentId}/
      └── {timestamp}-{filename}.mp4

avatars/
  └── student-{studentId}.jpg

reports/
  └── student-{studentId}/
      └── {reportId}.pdf
```

## ⚠️ 注意事项

1. **文件大小限制**：
   - Vercel Blob 免费版有大小限制
   - 视频文件可能较大，注意检查限制

2. **公开访问**：
   - 默认文件是公开的（`access: 'public'`）
   - 如果需要私有文件，需要修改配置

3. **删除文件**：
   - 删除数据库记录时，记得同时删除 Blob 文件
   - 避免产生存储费用

4. **环境变量**：
   - `BLOB_READ_WRITE_TOKEN` 只在服务端使用
   - 不要暴露到客户端代码中

## 🔍 检查配置状态

可以通过以下方式检查 Blob 是否配置：

```typescript
import { isBlobConfigured } from '@/lib/blob';

if (!isBlobConfigured()) {
  console.error('Blob 未配置');
}
```

## 📚 相关文档

- [Vercel Blob 文档](https://vercel.com/docs/storage/vercel-blob)
- [@vercel/blob SDK](https://www.npmjs.com/package/@vercel/blob)
