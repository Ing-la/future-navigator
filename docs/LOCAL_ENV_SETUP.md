# 本地开发环境配置指南

## 🎯 快速配置方法

### 方法 1：使用 Vercel CLI 自动拉取（推荐）

这是最简单的方法，会自动从 Vercel 拉取真实的环境变量：

```bash
# 1. 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 链接项目（选择你的项目）
vercel link

# 4. 拉取环境变量到 .env.local
vercel env pull .env.local
```

**执行后**：
- 会自动创建 `.env.local` 文件
- 包含 Vercel 中配置的所有环境变量
- 包含真实的密钥值（不要提交到 Git）

### 方法 2：手动创建 `.env.local`

如果不想使用 Vercel CLI，可以手动创建：

1. 复制下面的模板
2. 从 Vercel Dashboard 或 Supabase Dashboard 获取真实值
3. 创建 `.env.local` 文件并填写

## 📝 `.env.local` 文件模板

```env
# Supabase 配置
# 从 Vercel Dashboard → Environment Variables 获取
# 或从 Supabase Dashboard → Settings → API 获取
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Gemini API Key（可选，也可以通过管理员界面配置）
# 从 Google AI Studio 获取：https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Vercel Blob Token（本地开发时可能不需要）
# BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

## 🔍 如何获取环境变量值

### Supabase 配置

**方法 A：从 Vercel Dashboard**
1. 登录 Vercel
2. 进入项目设置 → Environment Variables
3. 查看 `SUPABASE_URL`、`SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`

**方法 B：从 Supabase Dashboard**
1. 登录 Supabase Dashboard
2. 进入 Settings → API
3. 复制 Project URL（SUPABASE_URL）
4. 复制 anon public key（SUPABASE_ANON_KEY）
5. 复制 service_role key（SUPABASE_SERVICE_ROLE_KEY）

### Gemini API Key

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的 API Key
3. 复制到 `.env.local`

## ⚠️ 重要提示

1. **`.env.local` 文件已在 `.gitignore` 中**
   - 不会被提交到 Git
   - 包含敏感信息，不要分享

2. **修改 `.env.local` 后需要重启开发服务器**
   ```bash
   # 停止当前服务器（Ctrl+C）
   # 重新启动
   npm run dev
   ```

3. **本地和 Vercel 环境变量应该一致**
   - 使用相同的 Supabase 项目
   - 使用相同的环境变量名称

## ✅ 验证配置

配置完成后，访问：
```
http://localhost:3000/api/health
```

应该返回：
```json
{
  "success": true,
  "environment": {
    "configured": true,
    "missing": []
  },
  "database": {
    "status": "ok"
  }
}
```
