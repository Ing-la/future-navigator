# 清理和功能添加计划

## 📋 第一部分：清理不需要的文件

### 可以删除的文件

1. **`.env.example`**
   - 原因：已有 `.env.local` 文件（包含详细说明）
   - 作用：`.env.example` 通常用于提供模板，但 `.env.local` 已经包含了所有说明

### 保留的文件

- `README.md` - 项目基础文档（必须）
- `docs/` 目录下的所有文档 - 项目文档（需要）

## 📋 第二部分：添加重置密码功能

### 功能需求

在管理员界面的用户列表中，为每个用户添加"修改密码"按钮：
- 位置：删除按钮左边
- 功能：管理员可以重置任意用户的密码
- 流程：点击按钮 → 弹出输入框 → 输入新密码 → 确认 → 更新数据库

### 需要实现的内容

#### 1. 创建修改密码模态框组件
**文件**：`app/components/admin/ResetPasswordModal.tsx`

**功能**：
- 显示用户名
- 输入新密码（两次确认）
- 密码强度提示
- 确认和取消按钮

#### 2. 创建更新密码 API
**文件**：`app/api/users/password/route.ts`（新建）

**功能**：
- 接收用户 ID 和新密码
- 使用 bcrypt 加密密码
- 更新 Supabase 数据库
- 返回成功/失败状态

#### 3. 更新 UserList 组件
**文件**：`app/components/admin/UserList.tsx`

**修改**：
- 添加 `onResetPassword` 回调 prop
- 在删除按钮左边添加"修改密码"按钮
- 按钮样式：蓝色（与删除按钮的红色区分）

#### 4. 更新 AdminDashboard 组件
**文件**：`app/components/admin/AdminDashboard.tsx`

**修改**：
- 添加重置密码的状态管理
- 实现 `handleResetPassword` 函数
- 集成 `ResetPasswordModal` 组件

### UI 设计

```
用户卡片布局：
[用户名] [角色]                    [修改密码] [删除]
```

按钮样式：
- 修改密码：蓝色按钮（`bg-blue-600`）
- 删除：红色按钮（`bg-red-600`）

## 🎯 执行顺序

1. 删除 `.env.example` 文件
2. 创建 `app/api/users/password/route.ts` - 更新密码 API
3. 创建 `app/components/admin/ResetPasswordModal.tsx` - 密码重置模态框
4. 更新 `app/components/admin/UserList.tsx` - 添加修改密码按钮
5. 更新 `app/components/admin/AdminDashboard.tsx` - 集成重置密码功能
6. 测试功能

## ✅ 预期效果

完成后：
1. 项目更干净（删除了不需要的文件）
2. 管理员可以重置任意用户的密码
3. 密码使用 bcrypt 加密存储
4. UI 友好，有确认提示
