import Link from "next/link"
import type { BlogPost } from "@/lib/data"

export default function BlogHeader({ post }: { post: BlogPost }) {
  return (
    <div className="mb-14 sm:mb-16">
      <Link
        href="/blogs"
        className="text-sm text-muted-foreground hover:text-accent transition-colors"
      >
        &larr; Writing
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span
            key={t}
            className="text-xs text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <h1 className="mt-3 text-lg text-foreground">
        {post.title}
      </h1>

      <p className="mt-3 max-w-xl text-sm text-muted-foreground leading-relaxed">
        {post.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground border-t border-dashed border-border pt-4">
        <span>{post.date}</span>
        <span>{post.readingTime} read</span>
      </div>
    </div>
  )
}
