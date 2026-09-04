"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { blogPosts } from "@/lib/data"

const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
              {sortedPosts.length} posts
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
              Blogs
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
              Notes on databases, web infrastructure, and the security
              questions underneath both.
            </p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {sortedPosts.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link
                  href={post.externalUrl ?? `/blog/${post.slug}`}
                  target={post.externalUrl ? "_blank" : undefined}
                  rel={post.externalUrl ? "noopener noreferrer" : undefined}
                  className="group grid grid-cols-[auto_1fr_auto] gap-4 sm:gap-8 items-baseline py-6 sm:py-8 text-left w-full hover:bg-card/50 transition-colors px-1 -mx-1"
                >
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {post.date} &middot; {post.externalUrl ? post.source : post.readingTime}
                      </span>
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                      {post.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[11px] uppercase tracking-wider text-accent"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent">
                    {post.externalUrl ? "↗" : "→"}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
