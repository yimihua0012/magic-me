# 套餐配额系统改造计划

## 1. 现状分析

### 当前模式
- **一次支付 = 一次生成**：Stripe/Lemon Squeezy 支付成功后，在 `generations` 表插入一条 `status='pending'` 的记录作为"配额"
- 用户点击生成时，消耗一条 pending 记录
- `style_count` 是固定的，由套餐决定，用户不可选择

### 存在的问题
- 无法按"次数"计费，只能按"次生成"计费
- 没有有效期限制
- 用户不能自由选择每次生成的图片数量
- 套餐配置（plans.ts）与业务需求不匹配

---

## 2. 目标模式

### 新套餐配置

| 套餐 | 价格 | 总次数 | 有效期 |
|------|------|--------|--------|
| Basic | $19 | 20 张 | 30 天 |
| Pro | $39 | 60 张 | 45 天 |
| Premium | $69 | 120 张 | 60 天 |

### 核心逻辑
1. **支付成功** → 创建一个"信用包"（credit package），包含总次数，但 **有效期未激活**（expires_at = NULL）
2. **用户第一次生成** → 激活信用包，设置有效期（expires_at = NOW() + validity_days）
3. **用户生成图片** → 选择风格，选择的风格数量 = 本次生成张数，从信用包中核销对应张数
4. **信用包过期** → 剩余次数作废，不可使用，提前3天邮件提醒
5. **多包并存** → 优先使用最早激活/到期的信用包（FIFO）

### 前端展示
- 剩余总次数
- 信用包状态（已激活/未激活/已过期）
- 已激活包的到期时间
- 风格选择器 + 数量显示

### FAQ（英文）
- **"What happens if I don't use all my generations within the time limit?"**
  - Unused credits expire and become void after the validity period. You will receive an email reminder 3 days before expiration.
- **"Can I extend the validity period?"**
  - Yes, please contact our support team via email for extension options. Extension fees may apply.
- **"When does the validity period start?"**
  - The validity period starts from your **first generation**, not from the purchase date. Your credits remain safe until you begin using them.

---

## 3. 数据库设计

### 3.1 新增表：`credit_packages`

```sql
CREATE TABLE IF NOT EXISTS credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 套餐信息
    plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'pro', 'premium')),
    total_credits INTEGER NOT NULL,
    remaining_credits INTEGER NOT NULL,
    
    -- 有效期（从第一次生成开始计算）
    purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    activated_at TIMESTAMP WITH TIME ZONE,        -- 第一次生成时设置
    expires_at TIMESTAMP WITH TIME ZONE,          -- activated_at + validity_days
    validity_days INTEGER NOT NULL,               -- 套餐有效期天数
    
    -- 支付信息
    stripe_payment_id TEXT,
    lemon_order_id TEXT,
    amount_paid DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    
    -- 状态
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'expired', 'depleted')),
    -- inactive: 未使用，有效期未开始
    -- active: 已激活（第一次生成后），在有效期内
    -- expired: 已过期
    -- depleted: 次数用完
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_credit_packages_user_id ON credit_packages(user_id);
CREATE INDEX idx_credit_packages_status ON credit_packages(status);
CREATE INDEX idx_credit_packages_expires_at ON credit_packages(expires_at);

-- RLS
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credit packages"
    ON credit_packages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all credit packages"
    ON credit_packages FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- updated_at trigger
DROP TRIGGER IF EXISTS update_credit_packages_updated_at ON credit_packages;
CREATE TRIGGER update_credit_packages_updated_at
    BEFORE UPDATE ON credit_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 修改 `generations` 表

- 移除 `status='pending'` 作为配额的用法
- 新增 `credit_package_id` 字段关联使用的信用包
- `status` 仅表示生成状态：processing, completed, failed

```sql
ALTER TABLE generations 
ADD COLUMN IF NOT EXISTS credit_package_id UUID REFERENCES credit_packages(id) ON DELETE SET NULL;

ALTER TABLE generations 
ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0;

CREATE INDEX idx_generations_credit_package_id ON generations(credit_package_id);
```

---

## 4. 文件修改清单

### 4.1 配置文件

| 文件 | 修改内容 |
|------|---------|
| `backend/config/plans.ts` | 更新套餐配置：3档套餐（basic/pro/premium），价格、次数、有效期 |
| `backend/types/index.ts` | 新增 CreditPackage 类型 |

### 4.2 服务层

| 文件 | 修改内容 |
|------|---------|
| `backend/services/credit-package.service.ts` | **新增** — 信用包服务：创建、查询、核销、过期检查 |
| `backend/services/generation.service.ts` | 修改：激活生成时从信用包扣减次数；生成失败时回退次数 |
| `backend/services/email.service.ts` | **新增** — 邮件服务：过期提醒、支付确认、生成完成通知 |

### 4.3 API 路由

| 文件 | 修改内容 |
|------|---------|
| `src/app/api/credits/route.ts` | 重写：返回总剩余次数、最近到期时间、各包详情 |
| `src/app/api/generate-headshots/route.ts` | 修改 POST：检查可用信用包，从信用包预扣次数，生成完成/失败时核销/回退 |
| `src/app/api/stripe/webhook/route.ts` | 修改：支付成功后创建 credit_package 而不是 generation |
| `src/app/api/lemon/webhook/route.ts` | 修改：订单创建后创建 credit_package 而不是 generation |
| `src/app/api/generations/route.ts` | 调整：GET 列表正常返回，POST 移除 |

### 4.4 前端页面

| 文件 | 修改内容 |
|------|---------|
| `src/app/upload/page.tsx` | 显示剩余次数；选择风格（多选），数量 = 风格数；无次数时跳转定价 |
| `src/app/generate/[id]/page.tsx` | 接收风格列表，按风格数量生成；处理 402 跳转定价；失败时回退次数 |
| `src/app/pricing/page.tsx` | 更新套餐展示（三档 + 次数 + 有效期）；增加"有效期从第一次生成开始"说明；新增 FAQ 区域 |
| `src/app/dashboard/page.tsx` | 显示剩余次数、到期时间、信用包列表 |
| `src/lib/config/index.ts` | 更新 pricingConfig 匹配新套餐；包含有效期说明文案 |

### 4.5 数据库

| 文件 | 修改内容 |
|------|---------|
| `backend/db/schema.sql` | 新增 credit_packages 表；更新 generations 表字段 |

---

## 5. 实施步骤

### 步骤 1：更新配置和类型
- 更新 `plans.ts` 为新三档套餐
- 新增 `CreditPackage` TypeScript 类型
- 更新 `pricingConfig` 前端配置

### 步骤 2：新增信用包服务
- 创建 `credit-package.service.ts`
- 实现方法：
  - `createPackage(userId, planType)` — 创建信用包
  - `getAvailablePackages(userId)` — 获取用户所有有效（未过期且有剩余）信用包
  - `getTotalRemaining(userId)` — 获取总剩余次数和最近到期时间
  - `consumeCredits(userId, amount)` — 核销次数（FIFO，优先用最早到期的）
  - `refundCredits(packageId, amount)` — 回退次数（生成失败时）
  - `checkAndExpirePackages(userId)` — 检查并标记过期的包
  - `activatePackage(packageId)` — 第一次生成时激活信用包（设置 activated_at 和 expires_at）

### 步骤 3：修改生成服务
- `activateGeneration` 改为：
  1. 检查可用信用包
  2. 预扣次数
  3. 创建 generation 记录（关联 credit_package_id 和 credits_used）
  4. 开始生成
- 生成失败时调用 `refundCredits` 回退次数

### 步骤 4：修改 Webhook
- Stripe webhook：支付成功 → 调用 `createPackage` 创建信用包
- Lemon webhook：订单创建 → 调用 `createPackage` 创建信用包

### 步骤 5：修改 API 路由
- `/api/credits`：返回总剩余、最近到期、各包列表
- `/api/generate-headshots` POST：检查信用包 → 预扣 → 生成

### 步骤 6：前端改造
- 上传页：显示"剩余 X 张，Y 天后到期"
- 生成页：生成失败时提示并刷新次数
- 定价页：更新三档套餐展示
- Dashboard：新增额度概览

### 步骤 7：邮件服务
- 创建 `email.service.ts`，基于 Resend / SendGrid / SMTP 发送邮件
- 邮件模板：
  - 支付成功确认
  - 信用包即将过期提醒（提前3天）
  - 信用包已过期通知
  - 生成完成通知（可选）
- 在以下时机触发邮件：
  - Webhook 创建信用包后 → 发送支付确认
  - 信用包激活后，检查 `expires_at - 3天`，设置定时提醒任务
  - 信用包过期时 → 发送过期通知

### 步骤 8：数据库 SQL
- 提供完整的迁移 SQL 脚本（建表、加字段、索引、RLS）

---

## 6. 关键业务规则

### 6.1 有效期计算规则（核心）
- **购买时**：`expires_at = NULL`，`status = 'inactive'`，有效期未开始
- **第一次生成时**：设置 `activated_at = NOW()`，`expires_at = NOW() + validity_days`，`status = 'active'`
- **之后生成**：在 `expires_at` 之前可用，过期后不可使用
- **前端文案**："Validity period starts from your first generation, not purchase date"

### 6.2 次数核销时机
- **预扣**：点击生成时，从信用包预扣对应次数（风格数量）
- **核销**：生成成功，预扣即视为已使用
- **回退**：生成失败，将预扣的次数退回信用包

### 6.3 多信用包策略（FIFO）
- 用户有多个信用包时，按以下优先级使用：
  1. 已激活且最早到期的包
  2. 未激活的包（使用时会自动激活）
  3. 跳过已过期的包

### 6.4 风格选择与数量
- 用户在 upload 页面选择风格（checkbox 多选，按分类展示）
- 本次生成数量 = 选择的风格数量，每张图消耗 1 次
- 最大可选数量 = min(剩余次数, 总风格数)
- 实时显示"将消耗 X 次，剩余 Y 次"

### 6.5 过期处理
- 每次查询可用次数时，检查并标记已过期的包
- 过期包的剩余次数作废，不可使用
- 过期前3天发送邮件提醒（通过邮件服务）

### 6.6 邮件通知
| 时机 | 邮件类型 | 内容 |
|------|---------|------|
| 支付成功 | 确认邮件 | 套餐详情、总次数、有效期规则说明 |
| 信用包激活后 | 过期提醒（定时） | 提前3天提醒即将过期 |
| 信用包过期时 | 过期通知 | 过期作废说明，可联系客服延期 |
| 生成完成 | 可选通知 | 生成完成，可下载图片 |

### 6.7 FAQ 文案（英文，用于 Pricing 页面）
- **"What happens if I don't use all my generations within the time limit?"**
  - Unused credits expire and become void after the validity period. You will receive an email reminder 3 days before expiration.
- **"Can I extend the validity period?"**
  - Yes, please contact our support team via email for extension options. Extension fees may apply.
- **"When does the validity period start?"**
  - The validity period starts from your **first generation**, not from the purchase date. Your credits remain safe until you begin using them.

---

## 7. 风险与注意事项

### 7.1 数据迁移
- 现有 `generations` 表中 `status='pending'` 的记录（旧配额）如何处理？
  - 方案：提供迁移脚本，将旧 pending 记录转为 basic 信用包（1次，30天有效期）
  - 或者直接清理（如果数据量不大）

### 7.2 并发问题
- 同一用户同时发起多次生成请求，可能超额扣减
- 方案：使用数据库事务 + 行级锁（SELECT FOR UPDATE）确保原子性

### 7.3 生成失败回退
- 生成失败时需要回退次数，但要避免恶意刷次数
- 方案：仅在服务端检测到的失败（非用户主动取消）才回退

### 7.4 前端次数显示
- 生成过程中，剩余次数应该实时更新（预扣后立即减少）
- 生成失败后恢复

---

## 8. 验证清单

- [ ] 数据库迁移 SQL 执行成功
- [ ] 支付成功后正确创建信用包
- [ ] 剩余次数和到期时间正确显示
- [ ] 生成时正确扣减次数
- [ ] 生成失败时次数回退
- [ ] 信用包过期后不可使用
- [ ] 多信用包按 FIFO 顺序消耗
- [ ] 无次数时按钮禁用并跳转定价页
- [ ] 前端套餐展示与配置一致
- [ ] 有效期从第一次生成开始计算（而非付款）
- [ ] 风格选择器正常工作，数量 = 风格数
- [ ] 邮件通知正常发送（支付确认、过期提醒、过期通知）
- [ ] FAQ 文案正确显示在 Pricing 页面
- [ ] 过期前3天收到邮件提醒
