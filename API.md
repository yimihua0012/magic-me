# API 接口文档

## 目录

- [认证类接口](#认证类接口-auth)
- [生成类接口](#生成类接口-generations)
- [支付类接口](#支付类接口-payment)
- [资源类接口](#资源类接口-assets)
- [接口总览](#接口总览)

---

## 认证类接口 (Auth)

### 1. POST /api/auth/signup

用户注册（邮箱密码）

- **文件**: `src/app/api/auth/signup/route.ts`
- **认证**: 不需要

**请求体**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**返回**

```json
{
  "user": { "id": "...", "email": "...", ... },
  "session": { "access_token": "...", ... }
}
```

---

### 2. POST /api/auth/login

用户登录（邮箱密码）

- **文件**: `src/app/api/auth/login/route.ts`
- **认证**: 不需要

**请求体**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**返回**

```json
{
  "user": { "id": "...", "email": "...", ... },
  "session": { "access_token": "...", ... }
}
```

---

### 3. GET /api/auth/google

Google OAuth 登录（跳转到 Google 授权页）

- **文件**: `src/app/api/auth/google/route.ts`
- **认证**: 不需要
- **返回**: 302 重定向到 Google 授权页

---

### 4. GET /api/auth/callback

OAuth 回调，兑换 session

- **文件**: `src/app/api/auth/callback/route.ts`
- **认证**: 不需要
- **参数**: `?code=xxx`（授权码）
- **返回**: 302 重定向到 `/dashboard`

---

### 5. GET /api/auth/logout

退出登录

- **文件**: `src/app/api/auth/logout/route.ts`
- **认证**: 需要（清除当前 session）
- **返回**: 302 重定向到首页

---

### 6. GET /api/auth/me

获取当前登录用户信息

- **文件**: `src/app/api/auth/me/route.ts`
- **认证**: 需要

**成功返回 (200)**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  }
}
```

**未登录返回 (401)**

```json
{ "error": "Not authenticated" }
```

---

## 生成类接口 (Generations)

### 7. POST /api/generate-headshots

创建头像生成任务（异步后台执行）

- **文件**: `src/app/api/generate-headshots/route.ts`
- **认证**: 可选（未登录使用 anonymous）

**请求体**

```json
{
  "faceImageUrl": "https://example.com/face.jpg",
  "styleIds": ["linkedin_professional", "corporate_office"]
}
```

- `faceImageUrl` (必填): 人脸照片 URL
- `styleIds` (可选): 风格 ID 数组，不传则使用默认全部风格

**返回 (200)**

```json
{
  "taskId": "gen_xxx_xxx",
  "status": "processing",
  "estimatedTime": 180
}
```

---

### 8. GET /api/generate-headshots?taskId=xxx

查询生成任务状态

- **文件**: `src/app/api/generate-headshots/route.ts`
- **认证**: 不需要
- **缓存**: `Cache-Control: private, max-age=5, stale-while-revalidate=10`

**参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `taskId` | string | 是 | 生成任务 ID |

**返回 (200)**

```json
{
  "taskId": "gen_xxx_xxx",
  "status": "pending | processing | completed | failed",
  "progress": 0-100,
  "outputUrls": ["url1", "url2", ...]
}
```

**任务不存在 (404)**

```json
{ "error": "Generation not found" }
```

---

### 9. GET /api/generate-headshots（无 taskId）

获取生成配置（模式、模型版本、参数）

- **文件**: `src/app/api/generate-headshots/route.ts`
- **认证**: 不需要

**返回 (200)**

```json
{
  "generationMode": "mock | replicate",
  "hasReplicateKey": true,
  "modelVersion": "f65a6768...",
  "config": {
    "guidanceScale": 7.5,
    "numInferenceSteps": 30
  }
}
```

---

### 10. GET /api/generations

获取当前用户的所有生成记录（分页）

- **文件**: `src/app/api/generations/route.ts`
- **认证**: 可选（未登录返回空数组）

**参数**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `page` | number | 否 | 1 | 页码 |
| `limit` | number | 否 | 20 | 每页数量（最大 50） |

**返回 (200)**

```json
{
  "generations": [
    {
      "id": "...",
      "user_id": "...",
      "status": "completed",
      "plan_type": "basic",
      "style_count": 30,
      "input_photos": [],
      "output_photos": [],
      "progress": 100,
      "created_at": "2024-01-01T00:00:00.000Z",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### 11. POST /api/generations

手动创建生成记录（旧版接口）

- **文件**: `src/app/api/generations/route.ts`
- **认证**: 可选

**请求体**

```json
{
  "plan_type": "basic | pro",
  "photo_count": 30
}
```

**返回 (200)**

```json
{
  "generation": { "id": "...", "status": "pending", ... }
}
```

---

## 支付类接口 (Payment)

### Stripe

### 12. POST /api/stripe/create-checkout

创建 Stripe 结账会话

- **文件**: `src/app/api/stripe/create-checkout/route.ts`
- **认证**: 需要

**请求体**

```json
{
  "plan_type": "basic | pro"
}
```

**返回 (200)**

```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

**未登录 (401)**

```json
{ "error": "Not authenticated" }
```

**无效套餐 (400)**

```json
{ "error": "Invalid plan type" }
```

---

### 13. POST /api/stripe/webhook

Stripe 支付成功回调（Webhook）

- **文件**: `src/app/api/stripe/webhook/route.ts`
- **认证**: Stripe 签名验证 (`stripe-signature` header)
- **处理事件**: `checkout.session.completed`

**返回 (200)**

```json
{ "received": true }
```

**签名无效 (400)**

```json
{ "error": "Invalid signature" }
```

---

### Lemon Squeezy

### 14. POST /api/lemon/create-checkout

创建 Lemon Squeezy 结账

- **文件**: `src/app/api/lemon/create-checkout/route.ts`
- **认证**: 需要
- **超时**: 20 秒

**请求体**

```json
{
  "plan_type": "basic | pro"
}
```

**返回 (200)**

```json
{
  "url": "https://checkout.lemonsqueezy.com/..."
}
```

---

### 15. POST /api/lemon/webhook

Lemon Squeezy 订单回调（Webhook）

- **文件**: `src/app/api/lemon/webhook/route.ts`
- **认证**: HMAC SHA256 签名验证 (`x-signature` header)
- **处理事件**: `order_created`

**返回 (200)**

```json
{ "received": true }
```

**签名无效 (401)**

```json
{ "error": "Invalid signature" }
```

---

## 资源类接口 (Assets)

### 16. GET /api/og

生成 Open Graph 分享图（动态）

- **文件**: `src/app/api/og/route.tsx`
- **认证**: 不需要
- **返回**: PNG 图片 (`image/png`)

用途：社交媒体分享时的预览图

---

### 17. GET /api/icon

生成网站图标（favicon / apple touch icon）

- **文件**: `src/app/api/icon/route.tsx`
- **认证**: 不需要
- **返回**: PNG 图标 (`image/png`)

**参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `size` | number | 否 | 图标尺寸，如 `32`, `180` |

---

## 接口总览

| 类别 | 接口数 | 需要认证 | 说明 |
|------|--------|---------|------|
| 认证 | 6 | 2 个 (me, logout) | signup, login, google, callback, logout, me |
| 生成 | 5 | 可选 | create generation, query status, config, generations list, create record |
| 支付 | 4 | 2 个 + 2 个 webhook | stripe checkout, stripe webhook, lemon checkout, lemon webhook |
| 资源 | 2 | 不需要 | OG 图, 网站图标 |
| **总计** | **17** | | |

---

## 通用响应格式

### 成功响应

```json
{
  "data": {},
  "message": "success"
}
```

### 错误响应

```json
{
  "error": "错误描述信息"
}
```

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 / 签名无效 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
