"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { PostRow, Section } from "@/components/list-row"
import { blogPosts } from "@/lib/data"

const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-[46rem] px-6 pt-28 pb-16">
        <h1 className="text-sm text-foreground">Writing</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl leading-relaxed">
          Notes on databases, web infrastructure, and the security questions
          underneath both.
        </p>

        <Section label={`${sortedPosts.length} posts`}>
          {sortedPosts.map((post) => (
            <PostRow
              key={post.slug}
              title={post.title}
              meta={[
                post.date,
                post.externalUrl ? post.source : post.readingTime,
                post.tags.join(" · "),
              ]
                .filter(Boolean)
                .join(" · ")}
              href={post.externalUrl ?? `/blog/${post.slug}`}
              external={Boolean(post.externalUrl)}
            />
          ))}
        </Section>
      </div>

      <Footer />
    </main>
  )
}
