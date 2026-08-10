import Link from 'next/link'

export type BreadcrumbNavItem = {
  label: string
  href: string
}

type BreadcrumbNavProps = {
  items: readonly BreadcrumbNavItem[]
  className?: string
}

export default function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  if (items.length < 2) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.href}-${item.label}`} className="flex min-w-0 items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="truncate text-slate-700">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="truncate text-primary-600 hover:text-primary-700">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
