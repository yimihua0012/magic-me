# 多语言 SEO 与多货币实施计划

## 当前决策

- 英文使用根路径，不创建 `/en`。
- 非英文语言使用子目录：`/es`、`/fr`、`/de`、`/ja`。
- 多语言以 SEO 为优先：服务端根据路径输出对应 `<html lang>`。
- 非英文 Blog 暂不开放，也不进入 sitemap。
- 货币不再前端手动切换，直接跟随语言路径：
  - `/` 和 `/es` 使用 USD
  - `/fr` 和 `/de` 使用 EUR
  - `/ja` 使用 JPY
- 价格是固定配置，不随汇率变化。
- PayPal 是当前唯一多货币支付渠道；Stripe / Lemon 暂不处理，也没有对外入口。
- JPY 展示格式固定为 `JPY ￥2,900`，EUR 为 `€16.60`，USD 为 `$19.00`。
- 各语言页面相对独立，但 credits、退款、隐私、支付行为等产品事实必须一致。

## 已完成范围

- 多语言路由：首页、pricing、contact、questions、sample、landing、upload、Terms、Privacy、Refund。
- 英文仍使用原 Navbar/Footer，降低影响面。
- 非英文使用 `localized-navbar` / `localized-footer`。
- sitemap 按语言拆分：
  - `/sitemap.xml`
  - `/sitemap-es.xml`
  - `/sitemap-fr.xml`
  - `/sitemap-de.xml`
  - `/sitemap-ja.xml`
- robots 指向 sitemap，并排除 upload 操作页。
- 404/未知路径会回到对应语言首页；英文回根首页。
- PayPal 已支持 `plan + currency` 固定价格矩阵和 capture 金额/币种校验。
- 支付成功后保留语言路径，例如 `/ja/upload?payment=success`。
- CTA/按钮跳转带 `source` 参数，用于来源识别；canonical/sitemap/hreflang 不使用带 source 的 URL。
- 定价页 JSON-LD 按当前语言默认货币输出。
- 全局 JSON-LD 不再输出单一 USD offer。
- 非英文公开页已接入本地化 SEO keywords。
- 非英文首页已扩充到接近英文首页的信息密度，并保留本地化 CTA 来源参数。
- 登录页已拆出本地化版本，非英文登录/未登录跳转会带 `returnTo` 回到来源路径。
- 非英文 Navbar 登录入口进入对应语言 `/login`，退出后回对应语言首页；英文旧 Navbar/Footer 不改。
- Upload 主流程已抽成共享视图：非英文 `/upload` 使用本地化导航、文案、登录回跳、定价跳转和支付成功提示；英文 `/upload` 保留原有 Auth modal 行为。
- 首页图库、上传页关键 aria label 和支付成功有效期显示已本地化。
- Dashboard 已抽成共享视图，新增 `/es|fr|de|ja/dashboard`，非英文导航、登录回跳、上传/详情跳转会保留语言路径。
- Generate / Generations 已抽成共享视图，新增 `/es|fr|de|ja/generate/[id]` 和 `/es|fr|de|ja/generations/[id]`；非英文上传页进入对应语言生成页。
- robots 已排除非英文 dashboard / generate / generations / login 操作页。
- 生成状态 `currentStep` 属于只读展示信息，已在前端做多语言映射。
- style 名称属于内容资产，已规划为表结构扩展：`headshot_styles.localized_names` 和 `localized_category_labels` 使用 JSONB 存储各语言展示名；API 支持 `?locale=ja` 返回本地化 name，未填写时回退英文。
- 已新增 `013_headshot_style_localized_text.sql`，为当前 style 集合填充西班牙语、法语、德语、日语展示名；提示词不变。

## SEO Keywords 策略

关键词不放数据库，先放代码内容层，便于和页面版本一起发布、审核和回滚。

当前每种语言先放 4 个核心候选词，并在首页、landing、pricing、contact、questions、sample、upload 等页面扩展使用：

- 西班牙语：
  - `generador de headshots IA`
  - `fotos profesionales IA`
  - `foto LinkedIn IA`
  - `foto CV profesional`
- 法语：
  - `generateur portrait professionnel IA`
  - `photo LinkedIn IA`
  - `photo CV professionnelle`
  - `portrait professionnel LinkedIn`
- 德语：
  - `KI Headshot Generator`
  - `KI Bewerbungsfoto`
  - `LinkedIn Profilbild KI`
  - `professionelles Profilbild`
- 日语：
  - `AIヘッドショットジェネレーター`
  - `AI証明写真`
  - `LinkedInプロフィール写真`
  - `プロフィール写真 AI`

说明：没有 Google Search Console / Keyword Planner 权限时，不能精确确认流量数；这些是基于搜索意图和竞品词形的候选词。上线后应结合 Search Console 数据迭代。

## 数据库结论

当前不需要扩展数据库。

原因：

- 语言由 URL 决定。
- 货币由语言映射决定。
- PayPal capture 已写入 `amount_paid` 和 `currency`。
- 套餐权益来自共享配置 `backend/config/plans.ts`。
- SEO title / description / keywords 更适合当前阶段放代码内容层。

未来只有这些场景建议扩展：

- 要在收据/邮件/客服后台记录用户购买时语言：给 `credit_packages` 增加 `locale`。
- 要后台编辑多语言页面和 SEO：新增 `localized_pages` 或 `seo_pages` 表。
- 要不同地区不同 credits 或套餐权益：需要服务端 package version / region 策略。
- 要多语言邮件归档：记录 `receipt_language` 或 `locale`。

## 尚未完成的重点工作

1. Dashboard / Generate / Generations 已完成路由保持、关键可见文案和生成状态文案映射。
2. 深层错误消息暂不处理，允许保留英文。
3. style 名称需要执行数据库迁移并逐步填充各语言翻译；未填充时会回退英文。
3. Terms / Privacy / Refund 已有对应语言，但仍建议人工校对法律准确性。
4. Marketing 文案和 SEO keywords 已配置候选词，上线后需要用 Search Console / Keyword Planner 数据校准。
5. 旧 Generate / Generations 页面仍有 `<img>` lint 性能提示，不阻塞本次多语言切换，但后续可改为 `next/image`。
6. 发布前仍需要人工点测：语言切换、登录返回、退出返回、PayPal 成功回跳、404、sitemap、robots。
7. 构建前最后运行：
   - `npm run check:i18n`
   - `npx tsc --noEmit`
   - `npm run build`

## 建议后续顺序

1. 人工点测真实登录态下的 `/ja/upload -> /ja/generate/[id] -> /ja/generations/[id] -> /ja/dashboard` 全链路。
2. 执行 `012_headshot_styles_localization.sql` 和 `013_headshot_style_localized_text.sql`，然后人工校对 style 展示名。
3. 人工校对 Terms / Privacy / Refund 与营销文案。
4. 上线后用 Search Console 数据校准各语言 keywords、title、description。
5. 后续再评估是否把购买时 locale 写入数据库，当前阶段不需要。
6. 最终构建与全链路点测。

## 本轮验证结果

- `npm run check:i18n` 通过。
- `npx tsc --noEmit` 通过。
- `npm run build` 通过。
- 生产预览 `http://localhost:3000` 已启动。
- 已验证 `/ja` 输出 `lang="ja"`，日文首页图库文案存在。
- 已验证 `/de/pricing` 显示 EUR，`/ja/pricing` 显示 `JPY ￥`。
- 已验证 `/ja/login?returnTo=%2Fja%2Fupload` 显示日文登录文案。
- 已验证 `/ja/dashboard`、`/ja/generate/test-id`、`/ja/generations/test-id` 输出 `lang="ja"` 和对应日文关键文案。
- 已验证 `/sitemap-ja.xml` 和 `/robots.txt` 包含对应 sitemap。
- 已验证 robots 排除 `/ja/dashboard` 和 `/ja/generate`。
- 已验证未知路径跳转：`/ja/unknown-page -> /ja`，`/de/blog/foo -> /de`，`/ja/dashboard/extra -> /ja`，`/missing-page -> /`。
