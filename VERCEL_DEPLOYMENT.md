# Vercel 部署详细指南

## 一、准备工作

### 1. 确保项目已推送到 GitHub
如果项目还未推送到 GitHub，请先执行：

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI Headshot Generator"

# 创建 GitHub 仓库后，添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/ai-avatar.git

# 推送到 GitHub
git push -u origin main
```

---

## 二、注册/登录 Vercel

### 1. 访问 Vercel
- 打开 [https://vercel.com](https://vercel.com)

### 2. 使用 GitHub 登录
- 点击 **"Sign Up"** 或 **"Log In"**
- 选择 **"Continue with GitHub"**
- 授权 Vercel 访问您的 GitHub 账户

---

## 三、导入项目

### 1. 进入项目导入页面
登录后，点击右上角 **"Add New..."** → **"Project"**

### 2. 选择仓库
在 **"Import Git Repository"** 页面：
- 如果是首次使用，需要点击 **"Adjust GitHub App Permissions"**
- 授权 Vercel 访问您的 GitHub 仓库
- 在列表中找到 `ai-avatar` 项目
- 点击 **"Import"**

---

## 四、配置项目

### 1. 基本设置
在 **"Configure Project"** 页面：

| 设置项 | 值 |
|--------|-----|
| **Project Name** | `ai-headshot-generator`（或您喜欢的名称）|
| **Framework Preset** | `Next.js`（自动检测）|
| **Root Directory** | `./`（默认）|

### 2. 构建设置
| 设置项 | 值 |
|--------|-----|
| **Build Command** | `npm run build`（默认）|
| **Output Directory** | `.next`（默认）|
| **Install Command** | `npm install`（默认）|

### 3. Node.js 版本（可选）
在 **"Environment Variables"** 下方点击 **"Node.js Version"**
- 推荐选择 `18.x` 或 `20.x`

---

## 五、配置环境变量（重要！）

### 1. 展开 "Environment Variables" 部分

### 2. 逐个添加以下环境变量：

#### Supabase 配置
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxxxxxxxxxx.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Stripe 配置
```
Name: STRIPE_SECRET_KEY
Value: sk_live_xxxxx（生产环境）或 sk_test_xxxxx（测试环境）

Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_xxxxx（生产环境）或 pk_test_xxxxx（测试环境）

Name: STRIPE_WEBHOOK_SECRET
Value: whsec_xxxxx（从 Stripe Dashboard 获取）
```

#### 应用配置
```
Name: NEXT_PUBLIC_APP_URL
Value: https://your-project-name.vercel.app（或自定义域名）
```

#### 邮件配置（可选）
```
Name: RESEND_API_KEY
Value: re_xxxxx
```

### 3. 环境选择
每个环境变量可选择应用的环境：
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 六、部署

### 1. 点击部署
确认所有配置正确后，点击 **"Deploy"**

### 2. 等待构建
- Vercel 会自动执行 `npm install` 和 `npm run build`
- 构建过程约 1-3 分钟
- 可以点击 **"Building"** 查看实时日志

### 3. 部署成功
看到 **"🎉 Congratulations!"** 页面表示部署成功

### 4. 访问网站
点击 **"Continue to Dashboard"** → 点击预览链接访问网站
- 默认域名：`https://your-project-name.vercel.app`

---

## 七、配置自定义域名（可选）

### 1. 进入域名设置
- 在项目 Dashboard，点击 **"Settings"**
- 点击左侧 **"Domains"**

### 2. 添加域名
- 输入您的域名，如 `www.headshotai.com`
- 点击 **"Add"**

### 3. 配置 DNS
根据 Vercel 提示，在您的域名服务商处配置 DNS：

**A 记录方式：**
```
类型: A
名称: @
值: 76.76.21.21
```

**CNAME 记录方式：**
```
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

### 4. 等待生效
- DNS 生效需要几分钟到几小时
- Vercel 会自动配置 SSL 证书

---

## 八、配置 Stripe Webhook（生产环境必须）

### 1. 获取 Vercel 域名
复制您的生产域名，如：`https://your-domain.com`

### 2. 在 Stripe 配置 Webhook
1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 点击 **"Developers"** → **"Webhooks"**
3. 点击 **"Add endpoint"**
4. 输入 Webhook URL：
   ```
   https://your-domain.com/api/stripe/webhook
   ```
5. 选择监听事件：
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. 点击 **"Add endpoint"**
7. 复制生成的 **Signing secret**（以 `whsec_` 开头）

### 3. 更新 Vercel 环境变量
- 回到 Vercel 项目 **Settings** → **Environment Variables**
- 更新 `STRIPE_WEBHOOK_SECRET` 为新的 signing secret
- 点击 **"Save"**

### 4. 重新部署
- 在 **Deployments** 页面
- 点击最新部署右侧的 **"..."**
- 选择 **"Redeploy"**

---

## 九、后续更新部署

### 自动部署
每次推送到 GitHub 的 `main` 分支，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### 预览部署
推送到其他分支会创建预览部署：
```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```
Vercel 会生成预览链接，如：`https://ai-avatar-abc123.vercel.app`

---

## 十、监控和日志

### 1. 查看部署日志
- 在 **Deployments** 页面点击任意部署
- 点击 **"Functions"** 查看 API 路由日志
- 点击 **"Runtime Logs"** 查看实时日志

### 2. 配置告警
- 点击 **Settings** → **Notifications**
- 配置部署失败/成功的邮件通知

### 3. 性能监控
- Vercel 自带 Analytics 功能
- 在 **Analytics** 标签页查看访问数据

---

## 十一、常见问题

### Q: 构建失败 "Module not found"
检查 `package.json` 依赖是否完整：
```bash
npm install
```

### Q: 环境变量不生效
1. 确认变量名正确（区分大小写）
2. 添加后需要重新部署才能生效
3. `NEXT_PUBLIC_` 前缀的变量才能在客户端使用

### Q: API 路由返回 500
1. 检查环境变量是否配置正确
2. 查看 Vercel 函数日志定位错误
3. 确认 Supabase 连接正常

### Q: 图片上传失败
1. 检查 Supabase 存储桶是否创建
2. 确认存储策略已配置
3. 检查文件大小限制

---

## 部署检查清单

| 步骤 | 状态 |
|------|------|
| 项目推送到 GitHub | [ ] |
| Vercel 账号创建 | [ ] |
| 项目导入 Vercel | [ ] |
| 环境变量配置 | [ ] |
| 首次部署成功 | [ ] |
| 自定义域名配置（可选）| [ ] |
| Stripe Webhook 配置 | [ ] |
| 测试注册/登录流程 | [ ] |
| 测试支付流程 | [ ] |

---

## 环境变量完整清单

```env
# Supabase（必须）
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe（必须）
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App（必须）
NEXT_PUBLIC_APP_URL=

# Email（可选）
RESEND_API_KEY=
```

---

## 快速命令参考

```bash
# 本地开发
npm run dev

# 本地构建测试
npm run build
npm start

# 推送更新
git add . && git commit -m "Update" && git push

# 查看 Vercel CLI 日志（如已安装）
vercel logs
```
