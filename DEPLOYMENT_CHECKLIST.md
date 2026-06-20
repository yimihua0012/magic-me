# 项目上线准备清单

## 1. 环境配置与密钥管理

### 1.1 环境变量配置
- [ ] 更新 `.env.local` 为生产环境配置
- [ ] 设置 `NODE_ENV=production`
- [ ] 配置 HTTPS 相关环境变量
- [ ] 移除所有测试/开发环境的临时配置

### 1.2 密钥管理（至关重要）
- [ ] 在 Supabase 控制台获取生产环境密钥
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY  
  - SUPABASE_SERVICE_ROLE_KEY
- [ ] 在 Stripe 控制台获取生产密钥
  - STRIPE_SECRET_KEY
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - STRIPE_WEBHOOK_SECRET
- [ ] 获取 Resend API 密钥（用于邮件通知）
  - RESEND_API_KEY
- [ ] 配置 `NEXT_PUBLIC_APP_URL` 为生产域名

### 1.3 密钥安全
- [ ] 使用 Vercel/Netlify 环境变量管理，不提交密钥到代码库
- [ ] 启用密钥轮换策略
- [ ] 限制 API 密钥的访问权限

---

## 2. 数据库配置

### 2.1 Supabase 数据库
- [ ] 创建生产环境数据库
- [ ] 执行 `backend/db/schema.sql` 初始化 schema
- [ ] 启用 Row Level Security (RLS)
- [ ] 创建存储桶（input-photos、output-photos）
- [ ] 配置存储策略和权限
- [ ] 创建必需的索引（generations_user_id、generations_status）

### 2.2 数据迁移
- [ ] 运行所有数据库迁移脚本
- [ ] 验证迁移后的表结构
- [ ] 测试数据读写权限

---

## 3. 第三方服务集成

### 3.1 Stripe 配置
- [ ] 在 Stripe 控制台创建产品和价格
- [ ] 配置 Webhook 端点（生产域名 + `/api/stripe/webhook`）
- [ ] 测试 Webhook 签名验证
- [ ] 配置支付成功/失败回调 URL
- [ ] 设置发票和收据模板

### 3.2 Supabase Auth
- [ ] 配置 OAuth 提供者（Google、GitHub 等）
- [ ] 设置邮件模板（欢迎邮件、密码重置）
- [ ] 配置重定向 URL（生产域名）
- [ ] 启用邮件验证

### 3.3 Resend（邮件服务）
- [ ] 配置发送域名
- [ ] 验证发件人邮箱
- [ ] 创建邮件模板

---

## 4. 安全配置

### 4.1 HTTPS
- [ ] 确保生产环境使用 HTTPS
- [ ] 配置 SSL 证书（Let's Encrypt 或服务商提供）
- [ ] 强制 HTTPS 重定向

### 4.2 CORS 配置
- [ ] 在 Supabase 控制台配置 CORS 允许生产域名
- [ ] 配置 Next.js 跨域策略

### 4.3 安全头
- [ ] 配置 Content Security Policy (CSP)
- [ ] 配置 X-Frame-Options
- [ ] 配置 X-XSS-Protection
- [ ] 配置 Strict-Transport-Security

### 4.4 依赖安全
- [ ] 运行 `npm audit` 检查依赖漏洞
- [ ] 更新所有高风险依赖
- [ ] 配置 Dependabot 自动更新

---

## 5. 性能优化

### 5.1 构建优化
- [ ] 运行 `npm run build` 确保构建成功
- [ ] 启用 Next.js 压缩
- [ ] 配置图像优化（Next.js Image 组件）
- [ ] 启用增量静态生成（ISR）

### 5.2 缓存策略
- [ ] 配置浏览器缓存头
- [ ] 配置 CDN 缓存策略
- [ ] 启用静态资源版本化

### 5.3 代码优化
- [ ] 代码分割和懒加载
- [ ] 移除未使用的依赖
- [ ] 优化首屏加载时间

---

## 6. 部署配置

### 6.1 部署平台配置
- [ ] 配置 Vercel/Netlify/GitHub Pages 部署
- [ ] 设置构建命令：`npm run build`
- [ ] 配置环境变量
- [ ] 设置自定义域名

### 6.2 CI/CD 流水线
- [ ] 配置 GitHub Actions/GitLab CI
- [ ] 添加代码审查检查
- [ ] 添加自动化测试
- [ ] 添加部署前检查

---

## 7. 监控和日志

### 7.1 错误监控
- [ ] 集成 Sentry 或 New Relic
- [ ] 配置错误告警
- [ ] 设置性能监控

### 7.2 日志配置
- [ ] 配置结构化日志
- [ ] 设置日志保留策略
- [ ] 配置日志监控告警

### 7.3 健康检查
- [ ] 创建健康检查端点 `/api/health`
- [ ] 配置监控告警

---

## 8. 测试验证

### 8.1 功能测试
- [ ] 用户注册/登录流程
- [ ] 照片上传和人脸验证
- [ ] 头像生成流程
- [ ] 支付流程（使用 Stripe 测试卡）
- [ ] 邮件通知发送

### 8.2 性能测试
- [ ] 页面加载时间测试
- [ ] API 响应时间测试
- [ ] 并发用户测试

### 8.3 安全测试
- [ ] 渗透测试（OWASP Top 10）
- [ ] SQL 注入测试
- [ ] XSS 测试
- [ ] CSRF 防护测试

### 8.4 浏览器兼容性
- [ ] 主流浏览器测试（Chrome、Firefox、Safari、Edge）
- [ ] 移动端测试
- [ ] 响应式布局测试

---

## 9. 合规和法律

### 9.1 隐私政策
- [ ] 创建隐私政策页面
- [ ] 确保 GDPR/CCPA 合规
- [ ] 添加 Cookie 同意横幅

### 9.2 服务条款
- [ ] 创建服务条款页面
- [ ] 明确退款政策

### 9.3 Cookie 配置
- [ ] 配置 Cookie 同意管理
- [ ] 分类 Cookie 类型

---

## 10. 运维准备

### 10.1 部署清单
- [ ] 创建部署检查清单
- [ ] 设置回滚流程
- [ ] 配置备份策略

### 10.2 文档
- [ ] 更新 README.md
- [ ] 创建运维手册
- [ ] 创建 API 文档

### 10.3 团队培训
- [ ] 培训团队成员使用管理后台
- [ ] 制定故障处理流程

---

## 11. 上线前最终检查

| 检查项 | 状态 |
|--------|------|
| 所有环境变量已配置 | [ ] |
| 数据库已初始化并测试 | [ ] |
| 第三方服务已配置 | [ ] |
| SSL 证书已配置 | [ ] |
| 构建成功 | [ ] |
| 功能测试通过 | [ ] |
| 安全测试通过 | [ ] |
| 性能测试通过 | [ ] |
| 监控已配置 | [ ] |
| 回滚流程已准备 | [ ] |

---

## 上线命令清单

```bash
# 1. 检查依赖安全
npm audit

# 2. 构建项目
npm run build

# 3. 运行测试（如果有）
npm test

# 4. 部署到生产环境
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# 5. 验证部署
curl https://yourdomain.com/api/health
```
