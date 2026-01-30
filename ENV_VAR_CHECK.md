# 环境变量检查计划

## 🔍 当前代码中使用的环境变量

根据代码检查，我们使用的环境变量名称：

### Supabase 相关
- `SUPABASE_URL` - Supabase 项目 URL
- `SUPABASE_ANON_KEY` - Supabase Anon Key（公开密钥）
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key（管理员密钥）

### 其他
- `GEMINI_API_KEY` - Gemini API Key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob Token

## ⚠️ 可能的问题

Vercel 在创建 Supabase Database 时，**可能**会使用不同的环境变量名称。常见的变体：

1. **标准命名**（我们使用的）：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **可能的变体**：
   - `NEXT_PUBLIC_SUPABASE_URL`（如果需要在客户端使用）
   - `DATABASE_URL`（某些情况下）
   - 或者其他自定义名称

## 📋 验证计划

### 方法 1：使用 Vercel CLI 拉取环境变量（推荐）

```bash
# 1. 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 链接项目
vercel link

# 4. 拉取环境变量到本地
vercel env pull .env.local
```

**注意**：`.env.local` 文件包含敏感信息，不要提交到 Git。

### 方法 2：在 Vercel Dashboard 中检查

1. 进入 Vercel 项目设置
2. 查看 Environment Variables 页面
3. 确认实际的变量名称

### 方法 3：添加调试 API 来检查环境变量

创建一个 API 端点来检查环境变量（不返回实际值，只返回是否存在）：

```typescript
// app/api/debug/env/route.ts
export async function GET() {
  return NextResponse.json({
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
}
```

## 🛠️ 如果环境变量名称不匹配

如果发现 Vercel 使用的变量名不同，需要：

1. **选项 A**：在 Vercel 中重命名环境变量（推荐）
   - 使用我们代码中期望的名称

2. **选项 B**：修改代码使用 Vercel 的变量名
   - 更新 `lib/db.ts` 中的变量名

## ✅ 建议的执行步骤

1. **先执行 `vercel env pull`** 来查看实际的变量名
2. **对比代码中的变量名**，看是否匹配
3. **如果不匹配**，决定是修改 Vercel 配置还是修改代码
4. **添加调试 API** 来验证环境变量是否正确加载

## 🔒 安全注意事项

- `.env.local` 文件包含敏感信息，已在 `.gitignore` 中
- 不要将 `.env.local` 提交到 Git
- 调试 API 只返回布尔值，不返回实际密钥
