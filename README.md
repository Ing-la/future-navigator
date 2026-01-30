# Future Navigator

AI 驱动的学习助手平台，支持 Gemini 和国内大模型，提供智能对话、多模态分析等功能。

## 🚀 快速开始

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**

   **方法 A：使用 Vercel CLI（推荐）**
   ```bash
   # 安装 Vercel CLI
   npm i -g vercel
   
   # 登录 Vercel
   vercel login
   
   # 链接项目
   vercel link
   
   # 拉取环境变量（会自动创建 .env.local 文件）
   vercel env pull .env.local
   ```

   **方法 B：手动创建 `.env.local` 文件**
   ```bash
   # 复制项目根目录的 .env.local 文件
   # 从 Vercel Dashboard 或 Supabase Dashboard 获取真实值并填写
   ```

   详细说明请查看：[docs/LOCAL_ENV_SETUP.md](./docs/LOCAL_ENV_SETUP.md)

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   ```
   http://localhost:3000
   ```

## 📚 项目文档

- [Agent 上下文指南](./docs/AGENT_CONTEXT.md) - 快速了解项目状态
- [本地开发环境配置](./docs/LOCAL_ENV_SETUP.md) - 详细的本地开发配置指南
- [Supabase 数据库设置](./docs/SUPABASE_SETUP.md) - 数据库表结构和 SQL 脚本
- [部署指南](./docs/DEPLOYMENT.md) - Vercel 部署详细说明
- [调试指南](./docs/DEBUG_GUIDE.md) - 问题排查和调试方法
- [项目结构说明](./docs/PROJECT_STRUCTURE.md) - 项目目录结构和技术栈
- [更新日志](./docs/CHANGELOG.md) - 项目更新历史

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **前端**: React 19, TypeScript, Tailwind CSS 4
- **数据库**: Supabase (PostgreSQL)
- **存储**: Vercel Blob
- **AI SDK**: Vercel AI SDK (`@ai-sdk/google`)
- **部署**: Vercel (通过 GitHub 自动部署)

## 🔧 环境变量

项目需要以下环境变量（详细说明见 `.env.local` 文件）：

- `SUPABASE_URL` - Supabase 项目 URL
- `SUPABASE_ANON_KEY` - Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key
- `GEMINI_API_KEY` - Gemini API Key（可选，可通过管理员界面配置）
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob Token（Vercel 自动配置）

## 📁 项目结构

```
future-navigator/
├── app/                    # Next.js App Router
│   ├── api/                # API 路由（Serverless Functions）
│   ├── components/         # React 组件
│   ├── contexts/           # React Context
│   └── page.tsx            # 首页
├── lib/                    # 工具函数库
│   ├── db.ts              # Supabase 数据库连接
│   ├── auth.ts            # 认证工具
│   ├── config.ts          # 配置管理
│   └── gemini.ts          # Gemini API 封装
├── docs/                   # 项目文档
└── types/                  # TypeScript 类型定义
```

## 🚀 部署

项目已配置通过 GitHub 自动部署到 Vercel。

详细部署说明请查看：[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 📝 开发说明

### 认证系统
- 支持三种角色：教师、家长、管理员
- 管理员登录无需密码（demo）
- 用户数据存储在 Supabase 数据库
- 密码使用 bcrypt 加密

### 配置管理
- Gemini API Key 可通过管理员界面配置
- 配置存储在 Supabase 数据库
- 优先级：数据库配置 > 环境变量

### API 路由
- `/api/auth/login` - 用户登录
- `/api/auth/register` - 用户注册
- `/api/users` - 用户管理
- `/api/config` - 配置管理
- `/api/chat` - AI 聊天
- `/api/health` - 健康检查

## 🔍 调试

如果遇到问题：

1. 检查健康检查 API：`http://localhost:3000/api/health`
2. 查看 [调试指南](./docs/DEBUG_GUIDE.md)
3. 检查 Vercel 日志（部署后）

## 📄 License

MIT
