export default function KeywordStrip({ keywords }: { keywords: readonly string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {keywords.map((keyword) => (
        <span
          key={keyword}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
        >
          {keyword}
        </span>
      ))}
    </div>
  )
}
