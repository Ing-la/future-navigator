# Supabase 数据库设置指南

## 📋 前置要求

1. 已在 Vercel 中创建 Supabase Database
2. Vercel 已自动配置以下环境变量：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 🗄️ 数据库表结构

### 1. 用户表 (users)

用于存储用户账号信息。

```sql
-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('teacher', 'parent', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. AI 配置表 (ai_config)

用于存储 AI 模型配置（如 Gemini API Key）。

```sql
-- 创建 ai_config 表
CREATE TABLE IF NOT EXISTS ai_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL DEFAULT 'gemini',
  api_key_encrypted TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_ai_config_provider ON ai_config(provider);
CREATE INDEX IF NOT EXISTS idx_ai_config_is_active ON ai_config(is_active);

-- 创建更新时间触发器
CREATE TRIGGER update_ai_config_updated_at
  BEFORE UPDATE ON ai_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 🔒 Row Level Security (RLS) 策略

### users 表 RLS 策略

```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 策略：任何人都可以注册（插入）
CREATE POLICY "允许注册" ON users
  FOR INSERT
  WITH CHECK (true);

-- 策略：用户可以查看自己的信息（通过 API，实际由服务端控制）
-- 注意：实际应用中，用户信息通过 API 返回，不直接查询数据库
```

### ai_config 表 RLS 策略

```sql
-- 启用 RLS
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;

-- 策略：只有管理员可以访问（通过 Service Role Key 绕过 RLS）
-- 注意：实际应用中，配置通过 API 访问，使用 Service Role Key
```

## 📝 初始化数据（可选）

### 创建默认管理员账号（如果需要）

```sql
-- 注意：密码需要使用 bcrypt 加密
-- 这里只是示例，实际密码应该通过应用注册或管理员创建
-- 密码 "admin123" 的 bcrypt hash（示例，实际应该使用应用生成）
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2b$10$example_hash_here', 'admin')
ON CONFLICT (username) DO NOTHING;
```

## 🚀 执行步骤

### 方法 1: 通过 Supabase Dashboard

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 进入 **SQL Editor**
4. 复制上面的 SQL 脚本
5. 依次执行：
   - 先执行 `users` 表的创建脚本
   - 再执行 `ai_config` 表的创建脚本
   - 最后执行 RLS 策略脚本

### 方法 2: 通过 Vercel Supabase 管理界面

1. 在 Vercel 项目设置中找到 Supabase Database
2. 点击 "Open Dashboard"
3. 进入 SQL Editor
4. 执行上述 SQL 脚本

## ✅ 验证设置

执行以下查询验证表是否创建成功：

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'ai_config');

-- 检查 RLS 是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'ai_config');
```

## 🔐 安全注意事项

1. **密码加密**：
   - 密码使用 bcrypt 加密存储
   - 不要在代码中硬编码密码
   - 使用环境变量存储敏感信息

2. **API Key 加密**：
   - API Key 使用简单编码存储（Base64）
   - 后续可以升级为加密存储

3. **RLS 策略**：
   - 使用 Service Role Key 进行管理员操作
   - 客户端操作使用 Anon Key（受 RLS 限制）

## 📚 相关文档

- [Supabase 文档](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor](https://supabase.com/docs/guides/database/tables)
