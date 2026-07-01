# 多语言 SEO 上线后 Search Console 复盘手册

## 目标

这份文档用于多语言站点上线后的 SEO 复盘和迭代。

当前多语言页面已经配置：

- 英文默认根路径 `/`
- 西班牙语 `/es`
- 法语 `/fr`
- 德语 `/de`
- 日语 `/ja`
- 多语言 sitemap
- hreflang / canonical
- 各语言初版 title / description / keywords

上线后的重点不是继续猜关键词，而是用 Google Search Console 的真实数据判断每个语言页面应该怎么调整。

## 核心指标

在 Search Console 的 `Performance / Search results` 中重点看四个指标：

- `Impressions`：曝光量，说明 Google 是否愿意展示该页面。
- `Clicks`：点击量，说明页面是否获得真实访问。
- `CTR`：点击率，判断 title / description 是否吸引人。
- `Average position`：平均排名，判断页面内容和权重是否足够。

## 第一阶段：上线后检查

上线当天或上线后 1-2 天完成。

1. 提交 sitemap：
   - `/sitemap.xml`
   - `/sitemap-es.xml`
   - `/sitemap-fr.xml`
   - `/sitemap-de.xml`
   - `/sitemap-ja.xml`

2. 检查 robots：
   - 公开营销页允许抓取。
   - `/upload`
   - `/dashboard`
   - `/generate`
   - `/generations`
   - `/login`
   - `/api`
   这些操作页应被排除。

3. 用 URL Inspection 检查关键页面：
   - `/`
   - `/pricing`
   - `/es`
   - `/fr`
   - `/de`
   - `/ja`
   - `/ja/pricing`
   - `/de/pricing`

4. 检查页面是否能正常抓取：
   - 没有 `noindex`
   - canonical 指向正确语言 URL
   - 页面内容不是空白
   - 页面语言和 URL 语言一致

## 第二阶段：7 天观察

上线后 7 天左右先观察，不急着大改。

重点看：

- 哪些语言页面开始有 impressions。
- 哪些 sitemap 被 Google 读取。
- 是否有页面被排除索引。
- 是否有明显错误，比如 `/ja` 被识别成英文页。

如果 7 天内没有明显曝光，不一定是问题。新页面和新语言目录通常需要时间。

## 第三阶段：14-21 天关键词复盘

上线 2-3 周后开始第一次关键词复盘。

### 按页面过滤

分别查看这些页面的数据：

- `/es`
- `/fr`
- `/de`
- `/ja`
- `/es/pricing`
- `/fr/pricing`
- `/de/pricing`
- `/ja/pricing`
- `/es/landing`
- `/fr/landing`
- `/de/landing`
- `/ja/landing`
- `/es/questions`
- `/fr/questions`
- `/de/questions`
- `/ja/questions`
- `/es/sample`
- `/fr/sample`
- `/de/sample`
- `/ja/sample`

### 按 Query 看真实搜索词

不要只看我们预设的 keywords，要看 Google 实际给了哪些 query 曝光。

例如日语页面可能实际出现：

- `AIヘッドショット`
- `AI プロフィール写真`
- `LinkedIn 写真 AI`
- `ビジネス 写真 AI`
- `プロフィール写真 作成 AI`

德语页面可能实际出现：

- `KI Headshot Generator`
- `KI Bewerbungsfoto`
- `LinkedIn Profilbild KI`
- `professionelles Profilbild AI`

西班牙语页面可能实际出现：

- `fotos profesionales IA`
- `foto LinkedIn IA`
- `generador de fotos profesionales`
- `foto CV profesional`

法语页面可能实际出现：

- `photo LinkedIn IA`
- `portrait professionnel IA`
- `photo CV professionnelle`
- `generateur portrait IA`

这些真实 query 应该反向更新：

- title
- meta description
- H1 / H2
- 首屏 supporting copy
- FAQ
- questions 页面内容
- landing 页面段落

## 第四阶段：按国家判断语言是否匹配

在 Performance 中按 `Country` 查看各语言页面的曝光来源。

理想情况：

- `/de` 主要来自 Germany / Austria / Switzerland。
- `/fr` 主要来自 France / Belgium / Canada。
- `/ja` 主要来自 Japan。
- `/es` 来自 Spain 和拉美国家都可以接受。

需要关注的异常：

- `/ja` 曝光主要来自美国，但日本很少。
- `/de` 曝光来自非德语国家。
- `/fr` query 大量是英文。
- `/es` query 和页面内容不匹配。

处理方式：

- 调整该语言页面 title / description。
- 增加更自然的本地语言表达。
- 增加该语言用户常搜的同义词。
- 必要时增加 FAQ 或 landing 内容深度。

## 第五阶段：优化判断规则

### 高曝光，低 CTR

说明 Google 愿意展示，但用户不点。

优先改：

- title 是否清楚说明用途。
- description 是否有价格、速度、用途、一次付费等卖点。
- 是否包含真实 query 里的核心词。
- 是否过于机器翻译。

示例调整方向：

- 日语：强调 LinkedIn / 履歴書 / プロフィール写真。
- 德语：强调 Bewerbungsfoto / LinkedIn Profilbild / professionell。
- 法语：强调 LinkedIn / CV / portrait professionnel。
- 西语：强调 LinkedIn / CV / foto profesional。

### 有曝光，排名低

说明 Google 理解页面主题，但页面竞争力不够。

优先补：

- 页面正文内容深度。
- FAQ。
- 示例图片说明。
- 与摄影棚/证件照/LinkedIn 头像的对比。
- 内链，例如首页链接 pricing、sample、questions。

### 排名不错，点击低

说明页面主题对，但搜索结果不够吸引。

优先改：

- title 更具体。
- description 加结果承诺。
- pricing 页面突出一次付费和对应货币。
- sample 页面突出真实前后对比。

### 查询词和页面不匹配

例如 `/ja/pricing` 出现大量 “free ai photo” 类型 query。

处理方式：

- 不一定追这个词。
- 如果不是目标用户，忽略。
- 如果有商业价值，可以新建或扩展对应内容。

## 第六阶段：30 天正式调整

上线 30 天左右做第一轮正式 SEO 调整。

建议流程：

1. 导出 Search Console 数据：
   - Query
   - Page
   - Country
   - Impressions
   - Clicks
   - CTR
   - Position

2. 每个语言挑 5-10 个有价值 query。

3. 按页面归类：
   - 首页：通用需求词。
   - pricing：价格、费用、一次付费相关词。
   - sample：样例、效果、before after 相关词。
   - questions：疑问词、how、安全吗、适合什么用途。
   - landing：高转化商业词。

4. 更新：
   - `src/lib/localized-seo.ts`
   - 对应本地化内容文件
   - 页面 H1/H2/FAQ

5. 重新构建并提交 sitemap。

## 第七阶段：60-90 天内容扩展

如果某个语言开始稳定有曝光，可以考虑扩展内容。

优先级：

1. 扩 questions 页面，增加该语言真实 query 对应问题。
2. 扩 sample 页面，增加更多场景说明。
3. 扩 landing 页面，强化商业用途。
4. 再考虑是否开放非英文 blog。

非英文 blog 当前暂不开放。只有当某个语言已经有稳定搜索需求，并且有足够内容维护能力时再做。

## 每种语言的初始观察重点

### 日语 `/ja`

重点观察：

- `AIヘッドショット`
- `AIプロフィール写真`
- `LinkedIn 写真 AI`
- `ビジネス 写真 AI`
- `履歴書 写真 AI`

优化方向：

- 文案要自然，避免过度直译。
- 强调 LinkedIn、履歴書、ビジネスプロフィール。
- 价格页注意 JPY 显示，例如 `JPY ￥2,900`。

### 德语 `/de`

重点观察：

- `KI Headshot Generator`
- `KI Bewerbungsfoto`
- `LinkedIn Profilbild KI`
- `professionelles Profilbild`

优化方向：

- 强调 Bewerbungsfoto、LinkedIn Profilbild、professionell。
- pricing 使用 EUR。
- 文案避免英语残留过多。

### 法语 `/fr`

重点观察：

- `photo LinkedIn IA`
- `portrait professionnel IA`
- `photo CV professionnelle`
- `generateur portrait IA`

优化方向：

- 强调 LinkedIn、CV、portrait professionnel。
- pricing 使用 EUR。
- 注意法语表达自然度。

### 西班牙语 `/es`

重点观察：

- `fotos profesionales IA`
- `foto LinkedIn IA`
- `foto CV profesional`
- `generador de fotos profesionales`

优化方向：

- `/es` 暂时作为泛西语，不拆地区。
- 如果后续西班牙和拉美差异明显，再考虑地区化。
- pricing 使用 USD。

## 不建议现在做的事

- 不要频繁每天改 title / description。
- 不要为了无关高曝光词偏离产品定位。
- 不要立刻开放非英文 blog。
- 不要只看 keywords，要看 query + page + country 的组合。
- 不要把 dashboard / upload / generate 等操作页放进 sitemap。

## 常规复盘节奏

- 每周：看索引、错误、sitemap 是否正常。
- 每两周：看 query 和 page 数据。
- 每月：做一次 title / description / FAQ 调整。
- 每季度：判断是否扩展非英文内容模块。

## 当前项目对应文件

SEO 配置主要在：

- `src/lib/localized-seo.ts`
- `src/lib/localized-home-content.ts`
- `src/lib/localized-marketing-content.ts`
- `src/lib/localized-pricing-content.ts`
- `src/lib/localized-legal-content.ts`
- `src/lib/sitemap.ts`
- `src/app/robots.ts`

上线后 Search Console 数据回收后，优先改 `localized-seo.ts` 和对应页面内容文件。
