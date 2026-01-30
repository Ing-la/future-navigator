# 调试指南 - Supabase 连接问题

## 🔍 问题排查步骤

### 第一步：检查健康检查 API

部署后，访问：
```
https://your-vercel-domain.vercel.app/api/health
```

**预期响应**（成功）：
```json
{
  "success": true,
  "environment": {
    "configured": true,
    "missing": [],
    "details": {
      "url": true,
      "anonKey": true,
      "serviceRoleKey": true
    }
  },
  "database": {
    "status": "ok",
    "message": "数据库连接正常"
  },
  "envVars": {
    "SUPABASE_URL": true,
    "NEXT_PUBLIC_SUPABASE_URL": false,
    "SUPABASE_ANON_KEY": true,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": false,
    "SUPABASE_SERVICE_ROLE_KEY": true,
    ...
  }
}
```

**如果失败**，会显示：
- 哪些环境变量缺失
- 数据库连接错误信息

### 第二步：检查 Vercel 环境变量

1. 进入 Vercel 项目设置
2. 查看 Environment Variables 页面
3. 确认以下变量是否存在：
   - `SUPABASE_URL` 或 `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_ANON_KEY` 或 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`（必须）

### 第三步：检查 Vercel 日志

1. 进入 Vercel 项目的 Deployments 页面
2. 点击最新的部署
3. 查看 Function Logs
4. 查找错误信息，特别是：
   - "环境变量未配置"
   - "数据库连接失败"
   - Supabase 错误代码

### 第四步：测试注册功能

1. 打开网站
2. 打开浏览器开发者工具（F12）
3. 切换到 Network 标签
4. 尝试注册用户
5. 查看 `/api/auth/register` 请求的响应

**成功响应**：
```json
{
  "success": true,
  "message": "注册成功",
  "user": { ... }
}
```

**失败响应**（现在会显示详细错误）：
```json
{
  "success": false,
  "message": "注册失败",
  "details": "具体的错误信息",
  "code": "错误代码"
}
```

## 🛠️ 常见问题解决

### 问题 1: 环境变量未配置

**症状**：健康检查 API 返回 `configured: false`

**解决**：
1. 在 Vercel 中添加缺失的环境变量
2. 重新部署项目

### 问题 2: SUPABASE_SERVICE_ROLE_KEY 缺失

**症状**：注册失败，错误信息包含 "SUPABASE_SERVICE_ROLE_KEY"

**解决**：
1. 在 Supabase Dashboard → Settings → API
2. 复制 Service Role Key
3. 在 Vercel 中添加 `SUPABASE_SERVICE_ROLE_KEY`

### 问题 3: 数据库表不存在

**症状**：错误代码 `PGRST116`

**解决**：
1. 在 Supabase Dashboard → SQL Editor
2. 执行 `SUPABASE_SETUP.md` 中的 SQL 脚本

### 问题 4: RLS 策略阻止插入

**症状**：注册失败，错误信息包含权限相关

**解决**：
1. 确认使用了 `supabaseAdmin`（Service Role Key）
2. 检查 RLS 策略是否正确设置

## 📝 新增功能

### 1. 健康检查 API (`/api/health`)

用于快速诊断：
- 环境变量配置状态
- 数据库连接状态
- 所有环境变量的存在性（不返回实际值）

### 2. 增强的错误信息

所有 API 现在返回：
- `message`: 用户友好的错误信息
- `details`: 详细的技术错误信息
- `code`: 错误代码（如果有）

### 3. 详细的日志

所有错误都会记录到 Vercel 日志，包括：
- 环境变量状态
- 数据库错误详情
- 错误堆栈信息

## ✅ 验证清单

部署后，按顺序检查：

- [ ] 访问 `/api/health`，确认环境变量已配置
- [ ] 访问 `/api/health`，确认数据库连接正常
- [ ] 尝试注册用户，查看详细错误信息（如果有）
- [ ] 检查 Vercel 日志，确认没有错误
- [ ] 在 Supabase Dashboard 中确认用户已创建

## 🔗 相关文档

- `docs/SUPABASE_SETUP.md` - 数据库设置指南
- `docs/DEPLOYMENT.md` - 部署指南
- `docs/LOCAL_ENV_SETUP.md` - 本地开发环境配置
