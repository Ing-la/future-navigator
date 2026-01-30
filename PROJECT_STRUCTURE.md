# Future Navigator 项目结构说明

## 📁 目录结构

```
future-navigator/
├── app/                          # Next.js App Router
│   ├── api/                      # Serverless API 路由（Vercel Functions）
│   │   ├── auth/                 # 认证相关 API
│   │   │   ├── login/route.ts   # 登录接口
│   │   │   └── register/route.ts # 注册接口
│   │   ├── chat/route.ts         # AI 对话接口
│   │   └── analyze/route.ts      # 多模态分析接口
│   ├── components/                # React 组件
│   │   ├── admin/                # 管理员组件
│   │   ├── auth/                 # 认证相关组件
│   │   └── ...                   # 其他组件
│   ├── contexts/                 # React Context
│   │   └── AuthContext.tsx      # 用户认证上下文
│   ├── page.tsx                  # 首页
│   └── layout.tsx                # 根布局
├── lib/                          # 工具函数库
│   ├── gemini.ts                 # Gemini SDK 封装
│   ├── blob.ts                   # Vercel Blob 封装
│   └── db.ts                     # 数据库连接（待实现）
├── types/                        # TypeScript 类型定义
│   ├── user.d.ts                 # 用户相关类型
│   ├── ai.d.ts                   # AI 相关类型
│   └── session.d.ts              # 会话相关类型
├── public/                       # 静态资源
└── .env.example                  # 环境变量示例
```

## 🔧 API 路由说明

### 认证 API (`/api/auth/`)

- **POST `/api/auth/login`** - 用户登录
  - 请求体: `{ username, password, role }`
  - 返回: `{ success, user, token }`

- **POST `/api/auth/register`** - 用户注册
  - 请求体: `{ username, password, role }`
  - 返回: `{ success, user, token }`

### 对话 API (`/api/chat`)

- **POST `/api/chat`** - AI 对话（流式响应）
  - 请求体: `{ messages: Array<{role, content}> }`
  - 返回: Stream (使用 Vercel AI SDK)

### 分析 API (`/api/analyze`)

- **POST `/api/analyze`** - 多模态分析
  - 请求体: `{ videoUrl?, audioUrl?, sessionId }`
  - 返回: `{ success, taskId, status }`

## 📚 工具库说明

### `lib/gemini.ts`
- `getGeminiModel()` - 获取 Gemini 模型实例
- `generateTextResponse()` - 生成文本回复（非流式）
- `generateStreamResponse()` - 生成流式回复
- `analyzeMultimodal()` - 多模态分析

### `lib/blob.ts`
- `uploadFile()` - 上传文件到 Vercel Blob
- `listFiles()` - 列出文件
- `deleteFile()` - 删除文件
- `getPublicUrl()` - 获取公开 URL

### `lib/db.ts`
- 数据库连接逻辑（待实现）
- 支持 Prisma/Supabase/Neon

## 🔐 环境变量配置

复制 `.env.example` 为 `.env.local` 并填写：

```env
GEMINI_API_KEY=your_gemini_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## 🚀 部署说明

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 在 Vercel 项目设置中添加环境变量：
   - `GEMINI_API_KEY`
   - `BLOB_READ_WRITE_TOKEN`
3. 部署后，所有 `app/api/` 下的路由会自动部署为 Serverless Functions

### 本地开发

```bash
npm run dev
```

访问 `http://localhost:3000`

## 📝 待实现功能

- [ ] 数据库集成（用户数据持久化）
- [ ] JWT 认证实现
- [ ] Gemini 多模态分析完整实现
- [ ] 文件上传功能
- [ ] 学习报告生成
- [ ] 实时安全监控
