import Link from 'next/link'

type BlogSectionBodyProps = {
  body: string
}

export default function BlogSectionBody({ body }: BlogSectionBodyProps) {
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean)

  return (
    <div className="mt-3 space-y-4 text-base leading-8 text-slate-700">
      {blocks.map((block, index) => {
        if (isMarkdownTable(block)) {
          return <MarkdownTable key={`${index}-${block.slice(0, 24)}`} block={block} />
        }

        if (isBulletList(block)) {
          return <BulletList key={`${index}-${block.slice(0, 24)}`} block={block} />
        }

        return (
          <p key={`${index}-${block.slice(0, 24)}`}>
            <InlineLinks text={block} />
          </p>
        )
      })}
    </div>
  )
}

function MarkdownTable({ block }: { block: string }) {
  const rows = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'))
    .map((line) => line.slice(1, -1).split('|').map((cell) => cell.trim()))

  const [header, , ...bodyRows] = rows
  if (!header || bodyRows.length === 0) return <p>{block}</p>

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-slate-950">
          <tr>
            {header.map((cell) => (
              <th key={cell} scope="col" className="px-4 py-3 font-bold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {bodyRows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row.join('-')}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${cellIndex}-${cell}`} className="px-4 py-3 align-top text-slate-700">
                  <InlineLinks text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BulletList({ block }: { block: string }) {
  const items = block
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^-\s+/, ''))
    .filter(Boolean)

  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>
          <InlineLinks text={item} />
        </li>
      ))}
    </ul>
  )
}

function InlineLinks({ text }: { text: string }) {
  const parts = text.split(/(\/(?:[a-z0-9-]+)(?:\/[a-z0-9-]+)*)/gi)

  return (
    <>
      {parts.map((part, index) => {
        if (/^\/(?:[a-z0-9-]+)(?:\/[a-z0-9-]+)*$/i.test(part)) {
          return (
            <Link key={`${part}-${index}`} href={part} className="font-semibold text-primary-600 hover:text-primary-700">
              {part}
            </Link>
          )
        }

        return <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>
      })}
    </>
  )
}

function isMarkdownTable(block: string) {
  const lines = block.split(/\r?\n/).map((line) => line.trim())
  return lines.length >= 3 && lines[0].startsWith('|') && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[1])
}

function isBulletList(block: string) {
  const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  return lines.length > 1 && lines.every((line) => line.startsWith('- '))
}
