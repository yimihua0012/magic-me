const BLOG_START_DATE = Date.UTC(2026, 5, 30)
const DAY_IN_MS = 24 * 60 * 60 * 1000

const blogDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function getBlogPublishDate(index: number) {
  return blogDateFormatter.format(new Date(BLOG_START_DATE - index * DAY_IN_MS))
}

export function getBlogPublishIsoDate(index: number) {
  return new Date(BLOG_START_DATE - index * DAY_IN_MS).toISOString().slice(0, 10)
}
