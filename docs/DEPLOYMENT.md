# Future Navigator 部署指南

## 📋 部署前准备

### 1. GitHub 仓库准备

1. 确保代码已提交到 GitHub
2. 检查 `.gitignore` 已正确配置，不会提交敏感信息
3. 确认 `package.json` 中的依赖都已安装

### 2. Vercel 项目创建

1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 框架预设选择 "Next.js"
5. 点击 "Deploy"

## 🔧 环境变量配置

### 必须配置的环境变量

在 Vercel 项目设置 → Environment Variables 中添加：

#### 1. Gemini API Key（必须）
```
GEMINI_API_KEY=your_gemini_api_key_here
```
- 获取方式：访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
- 说明：也可以通过管理员界面配置（优先级更高）

#### 2. Vercel Blob（自动配置）
创建 Blob Storage 后，Vercel 会自动添加：
```
BLOB_READ_WRITE_TOKEN=auto_generated_token
```
- 配置方式：Vercel 项目 → Storage → Create Database → Blob
- 说明：创建后自动配置，无需手动添加

#### 3. Supabase（自动配置）
创建 Supabase Database 后，Vercel 会自动添加：
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
- 配置方式：Vercel 项目 → Storage → Create Database → Supabase
- 说明：创建后自动配置，无需手动添加

## 🗄️ 数据库设置

### Supabase 数据库表结构

部署后需要在 Supabase 中创建以下表：

#### 1. users 表（用户表）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('teacher', 'parent', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. ai_config 表（AI 配置表）
```sql
CREATE TABLE ai_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL, -- 'gemini', 'openai', etc.
  api_key_encrypted TEXT NOT NULL, -- 加密存储
  model_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. sessions 表（学习会话表，后续使用）
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  video_url TEXT,
  audio_url TEXT,
  analysis_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 部署步骤

### 1. 首次部署

1. **连接 GitHub 仓库**
   - 在 Vercel 中导入项目
   - 选择仓库和分支

2. **创建 Storage**
   - 进入项目 → Storage
   - 创建 Blob Storage
   - 创建 Supabase Database

3. **配置环境变量**
   - 进入项目 → Settings → Environment Variables
   - 添加 `GEMINI_API_KEY`
   - Blob 和 Supabase 的环境变量会自动添加

4. **重新部署**
   - 环境变量配置后，点击 "Redeploy"
   - 等待部署完成

### 2. 部署后配置

1. **访问应用**
   - 使用 Vercel 提供的域名访问
   - 或使用自定义域名

2. **管理员登录**
   - 点击设置按钮 → 管理员登录（无需密码）
   - 进入管理员界面

3. **配置 Gemini API Key**
   - 点击侧边栏 "系统配置"
   - 输入 Gemini API Key
   - 点击 "测试并保存"

## 📝 注意事项

### 环境变量优先级

1. **Gemini API Key**：
   - 管理员界面配置（存储在 Supabase）> 环境变量
   - 如果管理员配置了，优先使用配置的 Key
   - 如果未配置，使用环境变量中的 Key

2. **Blob 和 Supabase**：
   - 只能通过 Vercel 环境变量配置
   - 创建 Storage 后自动配置

### 数据迁移

- 开发阶段的 `localStorage` 数据不会迁移到生产环境
- 部署后需要重新注册用户账号
- AI 配置需要在管理员界面重新配置

### 安全建议

1. **API Key 安全**：
   - 不要在前端代码中硬编码 API Key
   - 使用环境变量或数据库存储
   - 定期轮换 API Key

2. **数据库安全**：
   - 使用 Supabase Row Level Security (RLS)
   - 加密存储敏感信息
   - 定期备份数据库

## 🔍 故障排查

### 常见问题

1. **AI 服务不可用**
   - 检查 Gemini API Key 是否配置
   - 检查 API Key 是否有效
   - 查看 Vercel 函数日志

2. **文件上传失败**
   - 检查 Blob Storage 是否创建
   - 检查 `BLOB_READ_WRITE_TOKEN` 环境变量

3. **数据库连接失败**
   - 检查 Supabase Database 是否创建
   - 检查 Supabase 环境变量是否正确
   - 检查数据库表是否创建

## 📞 支持

如有问题，请查看：
- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Gemini API 文档](https://ai.google.dev/docs)
