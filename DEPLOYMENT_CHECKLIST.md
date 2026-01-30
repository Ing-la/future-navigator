# Vercel 部署检查清单

## ✅ 代码检查

### 1. 构建测试
- [x] 本地 `npm run build` 成功
- [x] TypeScript 编译无错误
- [x] 所有路由正确生成

### 2. 依赖检查
- [x] `package.json` 依赖完整
- [x] 所有必需的包都已安装
- [x] 版本兼容性正常

### 3. 代码问题
- [x] 修复了 `toDataStreamResponse()` → `toTextStreamResponse()`
- [x] 修复了 `google()` 函数调用方式
- [x] 修复了 `systemInstruction` → `system` 参数

### ⚠️ 潜在问题

#### 问题 1: API Key 动态传递
**位置**: `lib/gemini.ts` 第 39-54 行

**问题描述**: 
在 serverless 环境中，直接修改 `process.env.GEMINI_API_KEY` 可能不会生效，因为环境变量可能是只读的。

**当前实现**:
```typescript
if (apiKey) {
  process.env.GEMINI_API_KEY = apiKey;
}
return google(geminiConfig.models[model]);
```

**影响**: 
- 如果用户通过 Web 界面配置了 API Key，可能无法正确传递
- 会回退到使用环境变量中的 API Key

**建议**: 
- 如果部署后测试发现 Web 配置的 API Key 不生效，需要改用其他方式
- 可以考虑将 API Key 存储在 Supabase 数据库中，API 路由从数据库读取

## 🔧 Vercel 配置检查

### 1. 环境变量配置
在 Vercel 项目设置 → Environment Variables 中需要配置：

- [ ] `GEMINI_API_KEY` - Gemini API Key（必须）
- [ ] `BLOB_READ_WRITE_TOKEN` - Vercel Blob Token（创建 Blob Storage 后自动添加）
- [ ] `SUPABASE_URL` - Supabase URL（创建 Supabase Database 后自动添加）
- [ ] `SUPABASE_ANON_KEY` - Supabase Anon Key（创建 Supabase Database 后自动添加）

### 2. Storage 创建
- [ ] 创建 Vercel Blob Storage
- [ ] 创建 Supabase Database

### 3. 构建配置
- [x] Framework Preset: Next.js
- [x] Build Command: `npm run build`（默认）
- [x] Output Directory: `.next`（默认）
- [x] Install Command: `npm install`（默认）

## 🧪 部署后测试

### 1. 基础功能测试
- [ ] 首页可以正常访问
- [ ] 登录界面可以打开
- [ ] 管理员登录功能正常
- [ ] 用户注册功能正常

### 2. API 测试
- [ ] `/api/chat` - 聊天 API（需要配置 GEMINI_API_KEY）
- [ ] `/api/config/test` - 配置测试 API
- [ ] `/api/config` - 配置管理 API

### 3. 配置功能测试
- [ ] 管理员可以打开配置界面
- [ ] 可以输入 Gemini API Key
- [ ] 配置测试功能正常
- [ ] 配置保存功能正常

### 4. AI 功能测试
- [ ] 聊天功能可以发送消息
- [ ] AI 可以正常回复（需要配置 API Key）
- [ ] 流式响应正常工作

## 🐛 常见问题排查

### 问题 1: 构建失败
**症状**: Vercel 构建日志显示 TypeScript 错误

**解决方案**:
1. 检查本地构建是否成功：`npm run build`
2. 查看构建日志中的具体错误信息
3. 确保所有类型定义正确

### 问题 2: API Key 未配置错误
**症状**: 聊天功能返回 "AI 服务未配置"

**解决方案**:
1. 检查 Vercel 环境变量中是否配置了 `GEMINI_API_KEY`
2. 检查环境变量是否应用到正确的环境（Production/Preview/Development）
3. 重新部署项目

### 问题 3: Web 配置的 API Key 不生效
**症状**: 通过管理员界面配置了 API Key，但聊天仍然失败

**可能原因**:
- `process.env.GEMINI_API_KEY` 在 serverless 环境中是只读的
- 动态设置的 API Key 无法传递到 `google()` 函数

**解决方案**:
1. 暂时使用环境变量中的 API Key
2. 后续实现从 Supabase 数据库读取配置的功能

### 问题 4: 流式响应不工作
**症状**: 聊天消息发送后没有响应

**检查项**:
1. 检查浏览器控制台是否有错误
2. 检查网络请求是否成功
3. 检查 API 路由日志
4. 确认 `toTextStreamResponse()` 方法正确使用

## 📝 部署步骤回顾

1. ✅ 代码已推送到 GitHub
2. ⏳ 在 Vercel 中创建项目
3. ⏳ 创建 Storage（Blob 和 Supabase）
4. ⏳ 配置环境变量
5. ⏳ 部署并测试

## 🔗 相关链接

- GitHub 仓库: https://github.com/Ing-la/future-navigator
- Vercel 文档: https://vercel.com/docs
- Gemini API 文档: https://ai.google.dev/docs
