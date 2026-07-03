# 页面新增 / 修改固定检查流程

> 适用范围：Magic-Headshot 所有公开页面新增、页面内容修改、SEO metadata 修改、结构化数据修改、路由迁移、sitemap/robots 调整。  
> 目标：每次页面变更都按同一套流程检查 SEO、页面友好度、移动端体验和搜索引擎可访问性，避免“页面能打开但不适合收录/不适合移动端/结构化数据不一致”的问题。

## 1. 先判断页面类型

每次新增或修改页面，先归类。

| 类型 | 示例 | 处理原则 |
| --- | --- | --- |
| 公开 SEO 页面 | `/`、`/pricing`、`/sample`、`/questions`、`/blog/*`、`/free-id-photo-tool`、多语言营销页 | 需要 metadata、canonical、hreflang、sitemap、可见内容、移动端检查 |
| 公开工具页 | `/free-id-photo-tool` | 需要可索引性、工具可用性、图片/Canvas/JS 可访问性、移动端交互检查 |
| 私有/操作页 | `/upload`、`/dashboard`、`/generate`、`/generations`、`/login` | 不进 sitemap；按需 noindex/robots disallow；重点检查功能和登录流 |
| 迁移/别名页 | `/photo-tools` -> `/free-id-photo-tool` | 使用永久重定向；不进 sitemap；canonical 指向最终页面 |
| 不存在页面 | 未知 URL | 返回真实 404，不重定向到首页，避免 soft 404 |

## 2. 新增公开页面必做

### 2.1 路由与访问

- 在 `src/app/.../page.tsx` 建页面。
- 如果是多语言页面，同步添加 `src/app/[locale]/.../page.tsx` 或明确说明暂不开放多语言版本。
- 如果经过 `src/middleware.ts` 白名单控制，需要加入：
  - `rootPageRoutes`
  - `localizedRoutes`
  - 必要时 `englishRoutes`
- 未知 URL 不允许重定向到首页，应保留真实 404。

### 2.2 Metadata

公开页面必须有：

- `title`
- `description`
- `keywords`，可选但建议核心页保留
- `alternates.canonical`
- `alternates.languages`，多语言互链页面必须有
- `openGraph`
- `twitter`

检查点：

- canonical 必须指向最终规范 URL。
- sitemap 里出现的 URL 与 canonical 一致。
- 不要让可索引页面出现 `noindex`。
- 私有页和操作页不要误进 sitemap。

### 2.3 Sitemap

新增公开页面后更新：

- `src/lib/sitemap.ts`
- 必要时更新 `public/sitemap-urls.txt` 作为提交记录/人工核对清单

要求：

- sitemap 只放 200、可索引、规范 URL。
- 迁移页、登录页、dashboard、upload、generate、generations、api 不放入 sitemap。
- 有关键图片的页面，尽量补充 image sitemap 信息。

### 2.4 Robots

检查：

- `src/app/robots.ts` 不阻断公开页面。
- 继续阻断私有/操作路径：
  - `/auth`
  - `/dashboard`
  - `/upload`
  - `/generate`
  - `/generations`
  - `/login`
  - `/api`
- 关键图片/预览资源必须允许抓取：
  - `/api/og`
  - `/api/icon`
  - `/_next/static`
  - `/_next/image`
  - `public/` 下静态图片

注意：robots.txt 控制抓取，不等于可靠 noindex。需要防止搜索结果出现的页面，优先使用页面级 `robots: { index: false }`。

## 3. 结构化数据检查

### 3.1 使用原则

只在页面真实呈现对应内容时输出结构化数据。

| JSON-LD 类型 | 必须满足 |
| --- | --- |
| `FAQPage` | 页面上必须可见相同问题和答案 |
| `Product` / `Offer` | 页面上必须可见对应价格、套餐、权益 |
| `CollectionPage` / `ItemList` | 页面上必须可见对应列表或样例 |
| `BlogPosting` | 页面必须是实际文章 |
| `BreadcrumbList` | 面包屑路径应与页面层级一致 |
| `WebApplication` | 页面确实代表工具/应用入口 |

### 3.2 FAQ 固定规则

- `FaqPageJsonLd` 的 `items` 必须来自页面上同一份可见数据。
- 不允许 JSON-LD 里有 FAQ，但页面没有 FAQ 区块。
- 不允许 JSON-LD 答案和页面答案不同步。
- 修改 FAQ 文案时，只改数据源，不手写两份。

当前项目约定：

- 英文 `/questions`：`questions` 既用于页面可见列表，也用于 `FaqPageJsonLd`。
- 多语言 `/questions`：`content.questions` 既用于页面可见列表，也用于 `FaqPageJsonLd`。
- 英文 `/landing`：`faqs` 既用于页面可见 FAQ，也用于 `FaqPageJsonLd`。
- 多语言 `/landing`：`content.faqs` 既用于页面可见 FAQ，也用于 `FaqPageJsonLd`。
- 首页当前不输出 `FAQPage`，除非未来增加真实可见 FAQ 区块。

## 4. 页面友好度检查

### 4.1 内容可读性

检查：

- H1 唯一且清晰。
- 首屏能说明页面用途。
- CTA 文案明确，不要只有 “Click here”。
- 重要信息不要只放在图片里。
- 页面核心内容不依赖登录后才出现。
- 不要关键词堆砌。
- 多语言页面不要机翻感明显，不要乱码。

### 4.2 内链

公开页面至少检查这些入口：

- 导航是否能到达核心页面。
- 页脚是否有重要页面入口。
- 新页面是否从相关页面获得 2-3 个自然内链。
- 新页面是否链接回相关转化页：
  - `/pricing`
  - `/sample`
  - `/questions`
  - `/blog`
  - `/free-id-photo-tool`

### 4.3 图片

检查：

- 公开内容图片使用 `next/image`，除非是用户本地预览、Canvas 工具或必须使用 `<img>`。
- 重要图片有描述性 `alt`。
- 装饰图片 alt 可为空，但不要把内容图片设为空 alt。
- 图片路径可公开访问。
- 关键图片加入 sitemap 或页面正文上下文。
- 不使用过暗、裁切严重、无法识别主体的首屏图片。

## 5. 移动端检查

### 5.1 必测视口

每次公开页面新增/大改，至少检查：

- 375 x 667，iPhone SE/小屏
- 390 x 844，常见 iPhone
- 430 x 932，大屏手机
- 768 x 1024，平板
- 1366 x 768，桌面

### 5.2 移动端重点

检查：

- 不横向溢出。
- 标题不挤压、不遮挡。
- 按钮文字不换成难看的多行。
- CTA 在首屏或首屏后合理位置可见。
- 导航菜单可打开/关闭。
- 表单输入框容易点击。
- 图片比例稳定，不造成布局跳动。
- sticky/fixed 元素不遮挡正文或按钮。
- iOS safe-area 不遮挡底部按钮。
- 工具页的上传、裁切、下载等核心操作在手机上可完成。

### 5.3 交互状态

必须检查：

- loading
- empty state
- error state
- disabled button
- success state
- logged out / logged in 差异，涉及私有流程时

## 6. 自动化检查命令

每次页面新增/修改后运行：

```bash
npm run check:i18n
npx tsc --noEmit
npm run lint
npm run build
```

说明：

- `npm run check:i18n`：检查多语言、sitemap、robots、SEO 防回退规则。
- `npx tsc --noEmit`：类型检查。
- `npm run lint`：代码规范检查。
- `npm run build`：生产构建检查。
- 如果 `npm run build` 因 `next/font` 拉 Google Fonts 失败，需要记录为网络失败；仍要保证 `tsc` 和 `lint` 通过。

## 7. 人工检查流程

### 7.1 页面级检查

新增或修改页面后，打开页面并检查：

- 页面是否 200。
- 页面内容是否完整。
- title/description 是否符合页面主题。
- canonical 是否正确。
- hreflang 是否正确。
- 是否有 noindex。
- 图片是否加载。
- JS 交互是否正常。
- 页面是否有明显布局错位。

### 7.2 SEO 源码检查

查看页面 HTML 或浏览器 Elements：

- `<title>`
- `<meta name="description">`
- `<link rel="canonical">`
- `<link rel="alternate" hreflang="...">`
- `<script type="application/ld+json">`
- Open Graph tags
- Twitter card tags

### 7.3 sitemap / robots 检查

检查 URL：

- `/robots.txt`
- `/sitemap.xml`
- `/sitemap-es.xml`
- `/sitemap-fr.xml`
- `/sitemap-de.xml`
- `/sitemap-ja.xml`

确认：

- 新公开页面在对应 sitemap 中。
- 私有页面不在 sitemap 中。
- robots 没有阻断公开资源。
- image sitemap namespace 正常输出。

## 8. 页面变更类型对应流程

### 8.1 新增公开营销页

必做：

1. 页面实现。
2. metadata。
3. canonical / hreflang。
4. sitemap。
5. 内链入口。
6. JSON-LD，按需。
7. 桌面 + 移动端检查。
8. 自动化命令。
9. 上线后提交 Search Console / Bing / IndexNow。

### 8.2 修改公开页面文案

必做：

1. 检查 title/description 是否仍匹配。
2. 如果 FAQ 改了，同步可见 FAQ 和 JSON-LD。
3. 如果图片改了，检查 alt 和 image sitemap。
4. 跑 `npm run check:i18n`、`npx tsc --noEmit`、`npm run lint`。

### 8.3 修改价格/套餐

必做：

1. 页面可见价格。
2. Pricing JSON-LD。
3. 多语言货币显示。
4. PayPal/Stripe/Lemon 配置。
5. `scripts/check-multilingual-config.mjs`。
6. 移动端套餐卡片不溢出。

### 8.4 修改路由或页面迁移

必做：

1. 旧 URL 使用永久重定向。
2. 新 URL 加入 sitemap。
3. 旧 URL 不进 sitemap。
4. 新 URL canonical 指向自身。
5. 内链全部改到新 URL。
6. Bing IndexNow 提交新 URL，必要时提交旧 URL 变化。

### 8.5 新增多语言页面

必做：

1. `generateStaticParams()` 覆盖 `es/fr/de/ja`。
2. `generateMetadata()` 使用本地化 title/description/keywords。
3. `languageAlternatesForPath()`。
4. `src/middleware.ts` 白名单。
5. `src/lib/sitemap.ts` 加入对应语言 sitemap。
6. 检查本地化文案是否乱码。
7. 移动端检查每种语言最长标题/按钮。

## 9. 上线后检查

上线当天：

1. Google Search Console 提交 sitemap。
2. Bing Webmaster Tools 提交 sitemap。
3. Bing IndexNow 提交新增/修改 URL。
4. 用 URL Inspection 检查核心 URL。
5. Rich Results Test 检查结构化数据。
6. 检查线上 `/robots.txt` 和 sitemap 输出。

上线后 7 天：

- 看是否被发现。
- 看 sitemap 是否读取。
- 看是否有 `Crawled - currently not indexed` 或 `Discovered - currently not indexed`。
- 看是否出现 soft 404。
- 看移动端可用性问题。

上线后 14-30 天：

- 按 query/page/country 复盘。
- 高曝光低 CTR：改 title/description。
- 有曝光排名低：补内容、样例、FAQ、内链。
- query 与页面不匹配：考虑新增更精准页面。

## 10. PR / 提交前固定清单

提交前逐项确认：

- [ ] 页面类型已判断。
- [ ] 公开页面有 metadata。
- [ ] canonical 正确。
- [ ] hreflang 正确。
- [ ] sitemap 已更新。
- [ ] 私有/操作页未进入 sitemap。
- [ ] robots 未阻断公开页面和关键资源。
- [ ] JSON-LD 与页面可见内容一致。
- [ ] FAQPage 只用于真实可见 FAQ。
- [ ] 图片有合适 alt。
- [ ] 移动端无横向滚动。
- [ ] CTA 可点击且不被遮挡。
- [ ] 表单/工具交互状态完整。
- [ ] `npm run check:i18n` 通过。
- [ ] `npx tsc --noEmit` 通过。
- [ ] `npm run lint` 通过。
- [ ] `npm run build` 通过，或记录明确的外部网络失败。

## 11. 推荐维护方式

- 每次新增 SEO 规则，都同步加到 `scripts/check-multilingual-config.mjs`。
- 每次新增公开页面，都同步更新本文件对应流程。
- 每月 SEO 复盘时，根据 Search Console / Bing 数据更新页面矩阵和关键词规划。
