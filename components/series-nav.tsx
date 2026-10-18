import Link from "next/link"
import { blogPosts, type BlogPost } from "@/lib/data"

// Previous / next cards under a post that's part of a series (set `series` in lib/data.ts)
export default function SeriesNav({ post }: { post: BlogPost }) {
  const series = post.series
  if (!series) return null
  const part = (n: number) => blogPosts.find((p) => p.series?.name === series.name && p.series.part === n)
  const prev = part(series.part - 1)
  const next = part(series.part + 1)
  if (!prev && !next) return null

  return (
    <nav aria-label={`${series.name} series`} className="mt-16 grid max-w-2xl gap-3 sm:grid-cols-2">
      {prev && (
        <Link
          href={`/blog/${prev.slug}`}
          className="group rounded border border-border p-4 hover:bg-muted/50 transition-colors"
        >
          <span className="block text-xs text-muted-foreground">&larr; Previous</span>
          <span className="mt-1 block text-sm text-foreground group-hover:text-accent transition-colors">{prev.title}</span>
        </Link>
      )}
      {next && (
        <Link
          href={`/blog/${next.slug}`}
          className="group rounded border border-border p-4 text-right hover:bg-muted/50 transition-colors sm:col-start-2"
        >
          <span className="block text-xs text-muted-foreground">Next &rarr;</span>
          <span className="mt-1 block text-sm text-foreground group-hover:text-accent transition-colors">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
