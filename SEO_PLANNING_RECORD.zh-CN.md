# Magic-Headshot SEO 规划记录

> 记录日期：2026-07-03  
> 项目：Next.js App Router 多语言 AI headshot / ID photo 工具站  
> 目标：让 Google 与 Bing 能稳定发现、抓取、理解、索引核心公开页面，并用 Search Console / Bing Webmaster Tools 数据持续迭代内容与技术 SEO。

## 1. 官方收录规则摘要

### 1.1 Google 收录基础

Google 的核心逻辑不是“提交后保证收录”，而是先满足可抓取、可渲染、可索引、可理解、内容有价值这几个条件。

关键要求：

- 页面必须返回稳定的 200 状态码，不能被登录、地理位置、异常重定向或资源阻断影响。
- robots.txt 主要控制抓取，不等于可靠的 noindex；不想出现在搜索结果的页面应使用 `noindex`，但该页面不能同时被 robots.txt 阻止抓取，否则搜索引擎可能看不到 noindex。
- sitemap 用于告诉搜索引擎“哪些 URL 重要”，但不是收录保证；sitemap 应只放规范 URL、可索引 URL、200 URL。
- canonical 要指向页面自身的规范版本；多语言页面要用 hreflang 建立互相关系，并带 `x-default`。
- 重要内容应在 HTML/可渲染 DOM 中可见，Google 需要能访问 CSS、JS、图片等关键资源。
- SEO 的目标是帮助搜索引擎理解内容，同时帮助用户判断是否点击；标题、描述、结构、内部链接都要服务真实用户。

官方参考：

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Google robots.txt: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Google localized versions / hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Google structured data guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies

### 1.2 Bing 收录基础

Bing 与 Google 的基础要求相近：清晰页面、可抓取、sitemap、规范 URL、避免垃圾内容。Bing 额外值得利用的是 IndexNow，它允许站点在新增、更新、删除 URL 时主动通知参与搜索引擎。

关键要求：

- 保持 `robots.txt` 可访问，并在其中暴露 sitemap。
- 在 Bing Webmaster Tools 中提交 sitemap，并用 URL Inspection 验证关键页面。
- 使用 IndexNow 时，需要在站点根目录或指定路径放置 UTF-8 key 文件，提交的 URL 必须属于同一 host。
- IndexNow 单次 POST 可提交一组 URL；成功响应只代表搜索引擎已收到通知，不代表已收录或排名。

官方参考：

- Bing Webmaster Guidelines: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- Bing Sitemaps help: https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed
- Bing URL Submission help: https://www.bing.com/webmasters/help/url-submission-62f2860b
- IndexNow documentation: https://www.indexnow.org/documentation

## 2. 项目 SEO 现状

### 2.1 技术栈与公开页面

项目使用 Next.js 15 App Router，公开 SEO 页面主要包括：

- 英文核心页：`/`、`/landing`、`/pricing`、`/free-id-photo-tool`、`/questions`、`/sample`、`/blog`、`/contact`、`/privacy`、`/terms`、`/refund`
- 英文博客页：`/blog/[slug]`
- 多语言页：`/es`、`/fr`、`/de`、`/ja` 及对应 `pricing`、`landing`、`questions`、`sample`、`contact`、`free-id-photo-tool`、legal 页面
- 私有/操作页：`/upload`、`/dashboard`、`/generate`、`/generations`、`/login`、`/api`

### 2.2 已具备的 SEO 能力

已有能力：

- `src/app/robots.ts` 已动态输出 robots 规则，并引用多语言 sitemap。
- `src/lib/sitemap.ts` 已按语言生成 sitemap：英文 root sitemap 和 es/fr/de/ja 独立 sitemap。
- `src/lib/i18n.ts` 已提供 `languageAlternatesForPath()`，支持 canonical、hreflang、`x-default`。
- 多数公开页面已有 `metadata` 或 `generateMetadata`，包含 title、description、canonical、openGraph、twitter。
- 已有结构化数据组件：Organization、WebSite、WebApplication、FAQPage、WebPage、CollectionPage、BreadcrumbList、Blog、BlogPosting、Pricing/Product/Offer。
- `src/app/api/admin/bing-url-submissions/route.ts` 已实现 IndexNow 提交前的 key 检查与 URL 批量提交。
- `src/app/api/admin/bing-url-inspection/route.ts` 已实现站内预检查：状态码、robots meta、canonical、sitemap 命中、HTML 大小。
- `scripts/check-multilingual-config.mjs` 已覆盖一部分多语言 SEO 配置检查。
- 已有 SEO 文档：关键词策略、Search Console 复盘手册、持续优化文件清单。

### 2.3 当前 sitemap 覆盖

`public/sitemap-urls.txt` 当前记录 71 个 URL，覆盖英文核心页、英文博客、多语言核心页与多语言 legal/free-id-photo-tool 页面。

需要注意：

- `public/sitemap.xml` 已被删除，当前项目实际使用 App Router 动态 sitemap route，这是合理方向。
- `public/sitemap-urls.txt` 是记录/提交辅助文件，不是运行时 sitemap 真源；运行时真源是 `src/lib/sitemap.ts`。

## 3. 差距与风险

### P0：上线前必须确认

1. 生产环境域名必须正确。
   - 检查 `NEXT_PUBLIC_APP_URL=https://magic-headshot.com`
   - 影响：canonical、sitemap、OG image、JSON-LD URL、IndexNow host

2. Bing IndexNow key 必须闭环。
   - 环境变量：`INDEXNOW_KEY`
   - 公开文件：`https://magic-headshot.com/{INDEXNOW_KEY}.txt`
   - 文件内容必须等于 key 本身
   - 现有 `public/a47453bef9664a08ae9365fe77f35d4d.txt` 可能就是 key 文件，需要与线上环境变量核对。

3. 关键页面必须返回 200 且不被 noindex。
   - 优先检查：`/`、`/pricing`、`/free-id-photo-tool`、`/sample`、`/questions`、`/blog`、`/blog/linkedin`
   - 多语言优先检查：`/ja`、`/de`、`/fr`、`/es`、`/{locale}/pricing`

4. 公开页面与私有页面边界要稳定。
   - sitemap 不应包含 `/upload`、`/dashboard`、`/generate`、`/generations`、`/login`、`/api`
   - robots 已 disallow 这些路径，方向正确。

### P1：技术 SEO 修复/增强

1. `src/lib/currency.ts` 中 JPY 显示存在乱码/模板风险。
   - 当前可见：`return \`JPY 锟?{formattedAmount}\``
   - 风险：日文价格页、结构化数据旁的展示内容、用户信任感受损。
   - 建议修为明确格式：`JPY ¥${formattedAmount}` 或 `¥${formattedAmount}`，并同步修正检查脚本。

2. PowerShell 中中文/日文显示乱码，但 Node 按 UTF-8 读取正常。
   - 结论：多数内容文件本身并未损坏，终端显示编码会误导检查。
   - 后续验收中文/日文内容时优先用 Node `fs.readFileSync(..., 'utf8')` 或浏览器渲染结果。

3. `src/app/contact/page.tsx` 是 client component，但插入了 JSON-LD。
   - 能工作，但 SEO 更稳的做法是把结构化数据放在 server page/layout 或独立 server component 中，减少客户端渲染依赖。

4. `/photo-tools` 是重定向页，不在 sitemap 中。
   - 当前方向合理：sitemap 放规范页 `/free-id-photo-tool`。
   - 需确认重定向为永久还是临时；若这是历史公开 URL，建议用永久重定向语义。

5. 图片 SEO 还可增强。
   - 当前图片 alt 已有覆盖，但 sitemap 未包含 image extension。
   - 可在后续为首页、sample、blog 关键图片补充 image sitemap 或在页面内容中增加更明确的图文说明。

### P2：内容质量与关键词结构

1. 英文内容已覆盖核心词，但仍偏“AI headshot 工具页 + 博客”结构。
   - 建议新增更明确的场景页，而不是只靠博客承接高意图词。

2. 多语言内容已有初版，但需要真实 Search Console 数据校准。
   - 当前不要频繁改标题；上线后 2-4 周看 query/page/country 后再迭代。

3. FAQ 与结构化数据要避免“页面上不可见但 JSON-LD 里有”的不一致。
   - FAQPage 的问题和答案应尽量与页面可见内容一致。

4. Review/aggregateRating 数据需要谨慎。
   - 当前部分 JSON-LD 使用 `ratingValue: 4.8`、`ratingCount: 10000`。
   - 如果页面没有真实可验证的评价来源，存在富结果质量风险；建议改成可证明的数据，或去掉 aggregateRating。

## 4. 页面与关键词规划

### 4.1 核心关键词簇

| 优先级 | 关键词 | 搜索意图 | 当前承接页 | 建议 |
| --- | --- | --- | --- | --- |
| P0 | AI headshot generator | 找工具 | `/`、`/pricing` | 保持首页为主承接 |
| P0 | AI headshots for LinkedIn | LinkedIn 头像 | `/`、`/landing`、`/blog/linkedin` | 新增 `/linkedin-headshots` 更直接 |
| P1 | AI resume photo generator | 简历/CV 照片 | `/sample`、`/blog/resume` | 新增 `/resume-photo` |
| P1 | professional headshots without photographer | 替代摄影师 | `/landing`、`/blog/no-photographer` | 新增长尾场景页 |
| P1 | free ID photo tool | 免费证件照/打印 | `/free-id-photo-tool` | 继续强化工具实用性 |
| P2 | team headshots online | 团队头像 | `/blog/teams`、`/blog/remote-teams` | 新增 `/team-headshots` |
| P2 | realistic AI headshots | 真实感/不像 AI | `/sample`、`/blog/realistic` | 新增 `/realistic-ai-headshots` |

### 4.2 推荐新增页面

1. `/linkedin-headshots`
   - 主词：AI headshots for LinkedIn
   - 内容：LinkedIn 圆形裁切、职业可信度、头像尺寸、示例、常见错误、CTA 到 pricing/upload

2. `/resume-photo`
   - 主词：AI resume photo generator
   - 内容：简历照片风格、国家/地区使用差异、不过度修饰、示例、FAQ

3. `/professional-headshots-without-photographer`
   - 主词：professional headshots without photographer
   - 内容：时间成本、价格对比、何时适合 AI、何时仍适合摄影师

4. `/team-headshots`
   - 主词：AI headshots for teams online
   - 内容：远程团队、统一背景、HR/Marketing 工作流、批量内链到 pricing/contact

5. `/realistic-ai-headshots`
   - 主词：realistic AI headshot generator
   - 内容：likeness、皮肤质感、背景、眼镜/牙齿/发际线检查清单

## 5. Google 执行流程

### 上线当天

1. 在 Google Search Console 验证域名属性。
2. 提交 sitemap：
   - `https://magic-headshot.com/sitemap.xml`
   - `https://magic-headshot.com/sitemap-es.xml`
   - `https://magic-headshot.com/sitemap-fr.xml`
   - `https://magic-headshot.com/sitemap-de.xml`
   - `https://magic-headshot.com/sitemap-ja.xml`
3. 用 URL Inspection 检查：
   - `/`
   - `/pricing`
   - `/free-id-photo-tool`
   - `/sample`
   - `/questions`
   - `/blog`
   - `/blog/linkedin`
   - `/ja`
   - `/de`
   - `/fr`
   - `/es`
4. Rich Results Test 检查：
   - 首页 WebApplication/FAQ
   - Pricing Product/Offer
   - BlogPosting
   - BreadcrumbList

### 上线后 7 天

观察，不大改：

- sitemap 是否成功读取
- Coverage / Indexing 是否有异常
- 是否出现 `Discovered - currently not indexed`
- 多语言页面是否被识别成正确语言
- 是否有 canonical 指向错误

### 上线后 14-30 天

开始小步迭代：

- 按 Page 查看 impressions
- 按 Query 查看实际曝光词
- 按 Country 判断语言/地区是否匹配
- 高曝光低 CTR：优先改 title/description
- 有曝光但排名低：优先补内容深度、FAQ、内链
- 相关 query 多但页面不够精准：考虑新增场景页

## 6. Bing 执行流程

### 上线当天

1. 在 Bing Webmaster Tools 添加并验证站点。
2. 提交全部 sitemap。
3. 验证 IndexNow key：
   - 访问 `/{INDEXNOW_KEY}.txt`
   - 确认响应 200 且内容等于 key
4. 使用项目后台 Bing URL Submit 工具提交核心 URL。
5. 使用项目后台 Bing URL Inspect 预检查关键页。

### IndexNow 提交策略

提交触发：

- 新增页面
- 重大内容更新
- canonical、noindex、robots、sitemap 变更
- 删除页面或重定向迁移

提交范围：

- 只提交公开、可索引、200 URL
- 不提交 `/upload`、`/dashboard`、`/generate`、`/generations`、`/login`、`/api`
- 批量提交优先用 sitemap 中的 URL 列表

## 7. 90 天执行路线

### 第 0-7 天：技术闭环

- 确认生产域名、robots、sitemap、canonical、hreflang。
- 确认 IndexNow key 文件与环境变量一致。
- 修复 JPY 显示乱码。
- 对核心页面跑 URL Inspection / Bing 预检查。
- 对结构化数据跑 Rich Results / Schema Validator。

### 第 8-30 天：数据观察与轻量调整

- 不频繁改动核心标题。
- 每周导出 Google Search Console 数据。
- 记录每个页面的 impressions、clicks、CTR、position。
- 修正明显低 CTR 的 title/description。
- 对 sample/questions/blog 增加自然内链。

### 第 31-60 天：新增场景页

按优先级上线：

1. `/linkedin-headshots`
2. `/resume-photo`
3. `/professional-headshots-without-photographer`

每个页面要求：

- 独立 title/description/canonical/hreflang
- WebPage + Breadcrumb JSON-LD
- 可见 FAQ
- 至少 3 个内部链接入口
- 上线后进入 sitemap，并通过 IndexNow 提交

### 第 61-90 天：扩展与多语言迭代

- 根据 GSC 数据选择一个表现最好的非英语市场优先扩展。
- 如果 `/de` 或 `/ja` 有稳定曝光，再考虑对应语言的场景页。
- 增加 image sitemap 或图文说明模块。
- 评估是否增加对比页：
  - AI headshot vs photographer
  - AI resume photo vs LinkedIn photo
  - Free ID photo tool vs paid passport photo service

## 8. 监控指标

### Google Search Console

- Indexed pages
- Not indexed reasons
- Sitemap discovered URLs
- Query impressions
- Query CTR
- Page average position
- Country distribution
- Rich result warnings

### Bing Webmaster Tools

- Submitted URLs / discovered URLs
- Crawl errors
- IndexNow response status
- URL Inspection live result
- Search keywords
- Backlinks

### 项目内部

- 页面 200/3xx/4xx 状态
- sitemap URL 数量变化
- canonical 是否等于最终 URL
- robots meta / x-robots-tag
- HTML 字节大小
- Web Vitals / Speed Insights
- CTA 点击与支付转化

## 9. 当前优先级清单

| 优先级 | 事项 | 文件/位置 |
| --- | --- | --- |
| P0 | 确认生产域名与 sitemap 输出 | `.env.local` / Vercel env / `src/lib/config.ts` |
| P0 | 验证 IndexNow key 文件 | `public/*.txt` / `INDEXNOW_KEY` |
| P0 | 检查核心 URL 可索引性 | GSC / Bing / 后台 inspect 工具 |
| P1 | 修复 JPY 显示乱码 | `src/lib/currency.ts`、`scripts/check-multilingual-config.mjs` |
| P1 | 审核 aggregateRating 是否有真实来源 | `src/components/seo/home-json-ld.tsx`、pricing JSON-LD |
| P1 | 强化 blog 内链到 sample/questions/pricing | `src/app/blog/[slug]/page.tsx`、`src/lib/seo-content.ts` |
| P2 | 新增 LinkedIn 场景页 | `src/app/linkedin-headshots/page.tsx` |
| P2 | 新增 Resume 场景页 | `src/app/resume-photo/page.tsx` |
| P2 | 新增 Without Photographer 场景页 | `src/app/professional-headshots-without-photographer/page.tsx` |
| P3 | 图片 sitemap / 图片说明增强 | `src/lib/sitemap.ts`、图片内容模块 |

## 10. 结论

当前项目的 SEO 基础设施已经比较完整，尤其是 sitemap、robots、多语言 metadata、结构化数据和 Bing/IndexNow 管理工具。短期最重要的不是继续堆关键词，而是完成生产环境闭环、验证收录入口、修复少量内容/编码风险，并用 Search Console 与 Bing Webmaster Tools 的真实数据决定下一轮内容扩展。

推荐策略：

1. 先保证核心页面稳定收录。
2. 再用 `/sample`、`/questions`、`/blog` 支撑内容深度。
3. 接着新增 3 个高意图英文场景页。
4. 最后根据真实曝光数据扩展多语言场景内容。
