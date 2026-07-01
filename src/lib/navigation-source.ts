export function withSource(href: string, source: string) {
  const [pathAndQuery, hash = ''] = href.split('#')
  const separator = pathAndQuery.includes('?') ? '&' : '?'
  const sourcedHref = `${pathAndQuery}${separator}source=${encodeURIComponent(source)}`
  return hash ? `${sourcedHref}#${hash}` : sourcedHref
}
