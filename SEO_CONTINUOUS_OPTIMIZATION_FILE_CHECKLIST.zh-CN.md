# SEO 持续优化文件清单

> 目标：把后续 SEO 工作拆成可持续处理的文件清单，方便部署后按优先级逐步优化。

## P0 上线验证

| 方向 | 涉及文件/位置 | 要检查/处理 |
| --- | --- | --- |
| 生产域名 | `.env.local` / Vercel 环境变量 | 确认 `NEXT_PUBLIC_APP_URL=https://magic-headshot.com` |
| Sitemap | `src/app/sitemap.xml/route.ts` | 根 sitemap 是否输出正式域名 |
| 多语言 sitemap | `src/app/sitemap-es.xml/route.ts`、`src/app/sitemap-fr.xml/route.ts`、`src/app/sitemap-de.xml/route.ts`、`src/app/sitemap-ja.xml/route.ts` | 各语言 sitemap 是否正常可访问 |
| Robots | `src/app/robots.ts` | 是否列出所有 sitemap |
| SEO 验证文档 | `SEO_SEARCH_CONSOLE_PLAYBOOK.zh-CN.md` | 上线后按文档提交 Search Console 和 URL Inspection |

## P1 多语言内容质量

| 方向 | 涉及文件/位置 | 要检查/处理 |
| --- | --- | --- |
| 多语言首页 | `src/lib/localized-home-content.ts` | 检查 ES/FR/DE/JA 文案自然度，后续扩充内容深度 |
| 多语言营销页 | `src/lib/localized-marketing-content.ts` | Contact / Questions / Sample / Landing 文案润色 |
| 多语言价格页 | `src/lib/localized-pricing-content.ts` | 增加更完整 FAQ、规则说明和本地化价格表达 |
| 多语言 Legal | `src/lib/localized-legal-content.ts` | Terms / Privacy / Refund 人工润色 |
| 多语言 SEO keywords | `src/lib/localized-seo.ts` | 根据 Search Console 查询词继续调整关键词 |

## P2 结构化数据

| 方向 | 涉及文件/位置 | 要检查/处理 |
| --- | --- | --- |
| 全站实体 | `src/app/layout.tsx` | Organization / WebSite / contactPoint / languages |
| 页面 JSON-LD | `src/components/seo/page-json-ld.tsx` | WebPage / ContactPage / FAQPage / CollectionPage / BreadcrumbList |
| 首页 JSON-LD | `src/components/seo/home-json-ld.tsx` | WebApplication / FAQPage / 首页图片 |
| 价格 JSON-LD | `src/components/seo/pricing-json-ld.tsx` | Product / Offer / aggregateRating / Breadcrumb |
| Blog 列表 JSON-LD | `src/components/seo/blog-json-ld.tsx` | Blog / Breadcrumb |
| Blog 文章 JSON-LD | `src/components/seo/blog-post-json-ld.tsx` | BlogPosting / ISO date / image / Breadcrumb |
| Blog 日期 | `src/lib/blog-dates.ts` | `datePublished` / `dateModified` 是否合理 |

## P3 图片 SEO

| 方向 | 涉及文件/位置 | 要检查/处理 |
| --- | --- | --- |
| 首页主图 | `public/home-pages/Ai headshot-linkedin-professional.jpg` | 后续可改名为更自然 SEO 文件名 |
| Landing 主图 | `public/landing-headshot-showcase.png` | 确认可被 Google 访问 |
| 样例图 | `public/home-pages/corporate/`、`public/home-pages/sample/` | 检查 alt、文件名、图片质量 |
| 图片引用 | `src/lib/seo-content.ts` | Sample / Blog 图片 alt 和描述优化 |
| 图片 sitemap | 待新增脚本或扩展 sitemap route | 后续把首页、sample、blog 图片加入 sitemap |

## P4 内链优化

| 方向 | 涉及文件/位置 | 要检查/处理 |
| --- | --- | --- |
| 英文首页 | `src/app/page.tsx` | 增加到 sample / questions / blog 的自然入口 |
| 多语言首页 | `src/components/home/localized-home-page.tsx` | 增加到 sample / questions / pricing 的自然入口 |
| Blog 列表 | `src/app/blog/page.tsx` | 分类、推荐阅读、热门主题 |
| Blog 文章 | `src/app/blog/[slug]/page.tsx` | 文章内部链接到 pricing / sample / questions / 相关文章 |
| Blog 内容源 | `src/lib/seo-content.ts` | 每篇文章增加内部链接结构或 CTA 配置 |
| Sample 页 | `src/app/sample/page.tsx`、`src/components/sample/localized-sample-page.tsx` | 链接到 pricing 和相关 blog |
| Questions 页 | `src/app/questions/page.tsx`、`src/components/questions/localized-questions-page.tsx` | 链接到 sample / pricing / upload |

## P5 技术 SEO

| 方向 | 涉及文件/位置 | 要检查/处理 |
| --- | --- | --- |
| hreflang | `src/lib/i18n.ts` | `languageAlternatesForPath` 是否覆盖所有核心页面 |
| 中间件语言路由 | `src/middleware.ts` | 404 回对应首页、多语言路由白名单 |
| 页面 metadata | `src/app/**/page.tsx`、`src/app/**/layout.tsx` | title / description / canonical / OG / Twitter |
| 本地化 metadata helper | `src/lib/localized-metadata.ts` | OG/Twitter 是否输出对应语言 |
| SEO 检查脚本 | `scripts/check-multilingual-config.mjs` | 后续可扩展检查 JSON-LD / hreflang / sitemap |
| 图片性能 warning | `src/components/generate/generation-page-view.tsx`、`src/components/generations/generation-info-page-view.tsx` | 后续把 `<img>` 优化为 `next/image` 或明确尺寸 |

## P6 内容增长

| 方向 | 涉及文件/位置 | 要检查/处理 |
| --- | --- | --- |
| 英文 Blog 内容 | `src/lib/seo-content.ts` | 继续增加英文长尾文章 |
| Blog 页面 | `src/app/blog/page.tsx`、`src/app/blog/[slug]/page.tsx` | 分类、标签、相关文章 |
| 多语言 Blog | 暂未启用 | 后续为 ES/FR/DE/JA 独立规划，不要直接复用英文 |
| 职业场景页 | 待新增 `src/app/...` 页面 | LinkedIn / resume / team photo / executive portrait 等场景页 |
| 对比页 | 待新增 `src/app/...` 页面 | AI headshot vs photographer、AI resume photo 等 |

## P7 Search Console 迭代

| 方向 | 涉及文件/位置 | 要检查/处理 |
| --- | --- | --- |
| 查询词优化 | `src/lib/localized-seo.ts`、页面 metadata | 根据曝光和 CTR 调整 title/description/keywords |
| 未索引页面 | sitemap route、页面内容 | 根据 Search Console Pages 报告修复 |
| 结构化数据 warning | `src/components/seo/*` | 根据 Rich Results / Schema Validator 微调 |
| 国家和语言表现 | 多语言内容文件 | 根据国家/语言曝光决定优先扩充哪个语言 |

## 建议处理顺序

1. 线上 Search Console 验证和 sitemap 提交。
2. 图片 sitemap。
3. Blog 内链增强。
4. 多语言首页内容扩充。
5. 多语言 pricing FAQ 扩充。
6. Blog 文章继续增长。
7. 图片文件名和 alt 系统优化。
8. 性能 warning 处理。
