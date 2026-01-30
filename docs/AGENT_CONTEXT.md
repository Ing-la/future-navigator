# Agent 上下文快速指南

## 📋 项目当前状态（2026-01-30）

### ✅ 已完成的核心功能

1. **UI/UX**
   - Gemini 风格的聊天界面
   - 响应式设计（移动端/桌面端）
   - 侧边栏滑动动画
   - 登录/注册界面

2. **认证系统**
   - 三种角色：教师、家长、管理员
   - 管理员无需密码登录（demo）
   - 用户注册/登录功能
   - 使用 Supabase 数据库存储

3. **数据库**
   - ✅ Supabase 已连接并正常工作
   - ✅ `users` 表已创建
   - ✅ `ai_config` 表已创建
   - ✅ 密码使用 bcrypt 加密

4. **配置管理**
   - 管理员可以配置 Gemini API Key
   - 配置存储在 Supabase `ai_config` 表
   - 支持从数据库读取配置

5. **API 路由**
   - `/api/auth/login` - 登录
   - `/api/auth/register` - 注册
   - `/api/users` - 用户管理
   - `/api/config` - 配置管理
   - `/api/chat` - AI 聊天（待完善）
   - `/api/health` - 健康检查

### 🔧 技术栈

- **框架**: Next.js 16 (App Router)
- **前端**: React 19, TypeScript, Tailwind CSS 4
- **数据库**: Supabase (PostgreSQL)
- **存储**: Vercel Blob
- **AI SDK**: Vercel AI SDK (`@ai-sdk/google`)
- **部署**: Vercel (通过 GitHub 自动部署)

### 📁 关键文件位置

```
app/
  ├── page.tsx              # 主页面（路由逻辑）
  ├── layout.tsx            # 根布局（AuthProvider）
  ├── contexts/
  │   └── AuthContext.tsx   # 认证上下文（使用 API）
  ├── components/
  │   ├── auth/            # 登录/注册组件
  │   ├── admin/           # 管理员界面
  │   └── ChatWindow.tsx   # 聊天窗口
  └── api/
      ├── auth/            # 认证 API（使用 Supabase）
      ├── users/           # 用户管理 API
      ├── config/          # 配置管理 API
      └── health/          # 健康检查 API

lib/
  ├── db.ts                # Supabase 连接（支持多种环境变量命名）
  ├── auth.ts              # 密码加密工具
  ├── config.ts            # 配置管理（从 Supabase 读取）
  └── gemini.ts            # Gemini API 封装（从数据库读取 Key）

docs/                      # 项目文档目录
  ├── AGENT_CONTEXT.md     # 本文件
  ├── LOCAL_ENV_SETUP.md   # 本地开发环境配置
  ├── SUPABASE_SETUP.md    # 数据库设置指南
  └── ...
```

### 🔑 环境变量

**Vercel 中已配置**：
- `SUPABASE_URL` 或 `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY` 或 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`（必须）
- `GEMINI_API_KEY`
- `BLOB_READ_WRITE_TOKEN`

**代码支持**：自动检测带/不带 `NEXT_PUBLIC_` 前缀的变量

**本地开发**：
- 需要创建 `.env.local` 文件
- 推荐使用 `vercel env pull .env.local` 自动获取
- 或手动从 Vercel Dashboard 复制环境变量

### 🎯 当前工作状态

- ✅ 数据库连接正常（Vercel 部署）
- ✅ 用户注册/登录正常
- ✅ 配置管理正常
- ⚠️ AI 聊天功能待完善（API 已实现，前端流式响应需优化）
- ⚠️ 本地开发需要配置 `.env.local` 文件

### 📝 重要文档

- `docs/LOCAL_ENV_SETUP.md` - 本地开发环境配置指南
- `docs/SUPABASE_SETUP.md` - 数据库设置指南
- `docs/DEPLOYMENT.md` - 部署指南
- `docs/DEBUG_GUIDE.md` - 调试指南

### ⚠️ 注意事项

1. **认证系统**：已从 localStorage 迁移到 Supabase
2. **配置管理**：Gemini API Key 存储在 Supabase，优先级高于环境变量
3. **错误处理**：所有 API 都有详细的错误日志和错误信息
4. **健康检查**：`/api/health` 可以快速诊断问题
5. **本地开发**：需要配置 `.env.local` 文件才能连接 Supabase

### 🚀 部署状态

- GitHub 仓库：`https://github.com/Ing-la/future-navigator.git`
- Vercel 项目：已连接并自动部署
- 数据库：Supabase 已连接并正常工作

### 🔄 本地开发环境配置

**快速配置**：
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录并链接项目
vercel login
vercel link

# 3. 拉取环境变量
vercel env pull .env.local

# 4. 启动开发服务器
npm run dev
```

详细说明见：`docs/LOCAL_ENV_SETUP.md`

---

**给新 Agent 的建议**：
- 如果遇到问题，先查看 `/api/health` 的返回结果
- 数据库相关操作使用 `lib/db.ts` 中的 `supabaseAdmin`
- 认证相关使用 `app/api/auth/` 中的 API
- 配置相关使用 `app/api/config/` 中的 API
- 本地开发时，确保 `.env.local` 文件已配置
