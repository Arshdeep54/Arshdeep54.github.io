import Link from "next/link"
import type { BlogPost } from "@/lib/data"

export default function BlogHeader({ post }: { post: BlogPost }) {
  return (
    <div className="mb-14 sm:mb-16">
      <Link
        href="/blogs"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
      >
        &larr; Blogs
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span
            key={t}
            className="font-mono text-[11px] uppercase tracking-wider text-accent"
          >
            {t}
          </span>
        ))}
      </div>

      <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-medium tracking-tight text-balance">
        {post.title}
      </h1>

      <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
        {post.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground border-t border-dashed border-border pt-4">
        <span>{post.date}</span>
        <span>{post.readingTime} read</span>
      </div>
    </div>
  )
}
