# Supabase 详细配置指南

## 一、创建 Supabase 项目

### 1. 注册/登录 Supabase
1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 **"Start your project"** 或 **"Sign In"**
3. 使用 GitHub 账号登录（推荐）或邮箱注册

### 2. 创建新项目
1. 点击 **"New Project"**
2. 填写项目信息：
   - **Name**: `headshot-ai` （或您喜欢的名称）
   - **Database Password**: 设置一个强密码（请保存好）
   - **Region**: 选择 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`（离中国最近）
   - **Pricing Plan**: 选择 `Free`（免费层）
3. 点击 **"Create new project"**
4. 等待项目初始化（约 2-3 分钟）

---

## 二、获取 API 密钥

### 1. 进入项目设置
1. 项目创建完成后，点击左侧菜单 **"Settings"**（齿轮图标）
2. 点击 **"API"** 选项

### 2. 复制以下信息到 `.env.local`
```
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# anon public key（公开密钥，用于前端）
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# service_role key（服务端密钥，用于后端操作，请保密！）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **重要**: `service_role_key` 拥有完全权限，切勿泄露或提交到代码库！

---

## 三、初始化数据库

### 方法一：SQL Editor 执行（推荐）

1. 在 Supabase 控制台，点击左侧 **"SQL Editor"**
2. 点击 **"New Query"**
3. 复制以下 SQL 并执行：

```sql
-- ============================================
-- HeadshotAI Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    stripe_customer_id TEXT UNIQUE,
    stripe_session_id TEXT,
    plan_type TEXT DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro', 'enterprise')),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- GENERATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    plan_type TEXT NOT NULL DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro')),
    style_count INTEGER NOT NULL DEFAULT 30,
    input_photos TEXT[] NOT NULL DEFAULT '{}',
    output_photos TEXT[] DEFAULT '{}',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_step TEXT,
    stripe_payment_id TEXT,
    amount_paid DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    error_message TEXT
);

-- Enable RLS
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for generations
CREATE POLICY "Users can view their own generations"
    ON generations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations"
    ON generations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations"
    ON generations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations"
    ON generations FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);

-- ============================================
-- AUTO CREATE PROFILE ON USER SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- UPDATE TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. 点击 **"Run"** 执行 SQL
5. 看到 "Success. No rows returned" 表示执行成功

---

## 四、配置存储桶（Storage）

### 1. 创建存储桶
1. 点击左侧 **"Storage"**
2. 点击 **"New Bucket"**
3. 创建两个存储桶：

**第一个存储桶 - 输入照片：**
- **Name**: `input-photos`
- **Public bucket**: ❌ 不勾选（私有）
- **File size limit**: `10485760`（10MB）
- **Allowed MIME types**: `image/jpeg,image/png,image/webp`

**第二个存储桶 - 输出照片：**
- **Name**: `output-photos`
- **Public bucket**: ✅ 勾选（公开）
- **File size limit**: `52428800`（50MB）
- **Allowed MIME types**: `image/jpeg,image/png,image/webp`

### 2. 配置存储策略

在 SQL Editor 中执行以下策略：

```sql
-- Storage Policies for input-photos (private)
CREATE POLICY "Users can upload their own input photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'input-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own input photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'input-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage Policies for output-photos (public)
CREATE POLICY "Anyone can view output photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'output-photos');
```

---

## 五、配置认证（Authentication）

### 1. 基础认证设置
1. 点击左侧 **"Authentication"** → **"Providers"**
2. 确保 **Email** 已启用
3. 配置 Email 设置：
   - ✅ Enable email signups
   - ✅ Confirm email（建议启用邮箱验证）

### 2. 配置 Google OAuth（可选）
1. 在 **"Providers"** 中找到 **Google**
2. 点击启用
3. 前往 [Google Cloud Console](https://console.cloud.google.com/) 创建 OAuth 凭据：
   - 创建 OAuth 2.0 客户端 ID
   - 授权重定向 URI: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
4. 将 **Client ID** 和 **Client Secret** 填入 Supabase

### 3. 配置重定向 URL
1. 点击 **"URL Configuration"**
2. 添加以下 URL：
   - **Site URL**: `http://localhost:3000`（开发）/ `https://yourdomain.com`（生产）
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/auth/callback`

---

## 六、配置邮件模板

### 1. 自定义邮件模板
1. 点击 **"Authentication"** → **"Email Templates"**
2. 可自定义以下模板：
   - **Confirm signup** - 注册确认邮件
   - **Magic Link** - 魔法链接登录
   - **Change Email Address** - 更改邮箱
   - **Reset Password** - 重置密码

### 2. 示例模板（Confirm signup）
```html
<h2>Welcome to HeadshotAI!</h2>
<p>Thanks for signing up! Please confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
<p>If you didn't create an account, you can ignore this email.</p>
```

---

## 七、验证配置

### 1. 检查表结构
1. 点击左侧 **"Table Editor"**
2. 确认看到以下表：
   - `profiles`
   - `generations`

### 2. 测试注册流程
1. 访问 `http://localhost:3000/login`
2. 尝试注册新用户
3. 检查 `profiles` 表是否自动创建记录

### 3. 检查存储桶
1. 点击 **"Storage"**
2. 确认看到：
   - `input-photos`
   - `output-photos`

---

## 八、生产环境配置

### 1. 配置自定义域名（可选）
1. 点击 **"Settings"** → **"Custom Domains"**
2. 添加您的域名
3. 配置 DNS 记录

### 2. 配置 CORS
1. 点击 **"Settings"** → **"API"**
2. 在 **CORS** 部分添加您的域名

### 3. 启用实时功能（可选）
1. 点击 **"Settings"** → **"API"**
2. 启用 **Realtime** 用于实时进度更新

---

## 九、环境变量汇总

将以下内容添加到 `.env.local`：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (下一步配置)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email (可选)
RESEND_API_KEY=re_xxxxx
```

---

## 十、常见问题

### Q: 表创建失败？
检查 SQL 语法，确保没有重复执行。可以先删除表再重新创建：
```sql
DROP TABLE IF EXISTS generations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

### Q: RLS 策略不生效？
确保已启用 RLS：
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
```

### Q: 存储上传失败？
检查存储策略是否正确配置，确保用户已登录。

---

## 配置完成检查清单

| 步骤 | 状态 |
|------|------|
| 创建 Supabase 项目 | [ ] |
| 获取 API 密钥 | [ ] |
| 执行数据库 Schema | [ ] |
| 创建存储桶 | [ ] |
| 配置存储策略 | [ ] |
| 配置认证设置 | [ ] |
| 配置重定向 URL | [ ] |
| 更新 .env.local | [ ] |
| 测试注册流程 | [ ] |
