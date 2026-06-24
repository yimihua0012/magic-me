# SEO 优化 - 线上同步清单

## 一、新增文件（需推送到 Git）

| 文件 | 说明 |
|------|------|
| `public/sitemap.xml` | 站点地图，包含 7 个页面 |
| `public/robots.txt` | 爬虫规则，禁止爬取 /api/、/dashboard/、/generate/、/upload/ |
| `public/manifest.json` | PWA 配置，图标使用动态 API |
| `public/logo.svg` | Logo 图标 |
| `public/favicon.svg` | Favicon 图标 |
| `public/apple-touch-icon.svg` | Apple Touch 图标 |
| `public/icon-192.svg` | PWA 图标 192x192 |
| `public/icon-512.svg` | PWA 图标 512x512 |
| `src/app/api/og/route.tsx` | 动态生成 OG 分享图片（1200x630） |
| `src/app/api/icon/route.tsx` | 动态生成各尺寸图标 |

## 二、修改文件（需推送到 Git）

| 文件 | 改动说明 |
|------|----------|
| `src/app/layout.tsx` | SEO 全面增强：metadataBase、title template、robots、canonical、Open Graph 完整配置、Twitter Card、JSON-LD 结构化数据（WebApplication + Offer + AggregateRating + FAQ）、动态 favicon 和 manifest、精简 keywords（6 个核心词） |
| `src/app/page.tsx` | Tier 4 长尾关键词整合：H1 标题改为 "Get Professional Headshots Without a Photographer"、6 个 features 重写融入长尾词、3 个 testimonials 更新自然包含关键词 |
| `src/app/pricing/page.tsx` | 添加独立 metadata（title、description、keywords）、H1 和描述整合长尾关键词 |
| `src/components/layout/navbar.tsx` | Logo 从 Camera 图标替换为 logo.svg |
| `src/components/layout/footer.tsx` | Logo 从 Camera 图标替换为 logo.svg |

## 三、环境变量更新（需同步到 Vercel）

| 变量名 | 新值 | 说明 |
|--------|------|------|
| `NEXT_PUBLIC_APP_KEYWORDS` | `Magic-Headshot,AI headshot generator,professional headshots without photographer,LinkedIn profile photo maker,AI business portrait,virtual headshot generator,team photos online` | 精简为 7 个核心关键词 |

## 四、环境变量确认（无需修改，确认已配置即可）

| 变量名 | 要求 |
|--------|------|
| `NEXT_PUBLIC_APP_URL` | 必须为 `https://magic-headshot.com`（影响 canonical URL、sitemap、OG 图片链接） |
| `NEXT_PUBLIC_APP_NAME` | `Magic-Headshot` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | `Professional AI Headshot Generator` |
| `NEXT_PUBLIC_APP_TITLE` | `Magic-Headshot - Professional AI Headshot Generator in 3 Minutes` |
| `NEXT_PUBLIC_APP_KEYWORDS` | `Magic-Headshot,AI headshot, professional photos, LinkedIn photo, AI portrait, headshot generator` |

## 四、部署后操作

1. **提交 Sitemap** - 在 Google Search Console 提交 `https://magic-headshot.com/sitemap.xml`
2. **验证结构化数据** - 用 Google Rich Results Test 验证 JSON-LD：https://search.google.com/test/rich-results
3. **验证 OG 图片** - 用 Facebook Sharing Debugger 验证：https://developers.facebook.com/tools/debug/
4. **验证 Twitter Card** - 用 Twitter Card Validator 验证：https://cards-dev.twitter.com/validator
