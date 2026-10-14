import fs from "node:fs"
import path from "node:path"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import BlogHeader from "@/components/blog-header"
import ToTop from "@/components/to-top"
import { blogPosts } from "@/lib/data"
import TwoParsersOneStream from "@/components/blog-posts/two-parsers-one-stream"
import LedgerPattern from "@/components/blog-posts/ledger-pattern"
import ReadOnlyTests from "@/components/blog-posts/read-only-tests"
import MarkdownPost, { hasMarkdown } from "@/components/markdown-post"
import LiveDraft from "@/components/live-draft"

const content: Record<string, React.ComponentType> = {
  "two-parsers-one-stream": TwoParsersOneStream,
  "ledger-pattern": LedgerPattern,
  "read-only-tests": ReadOnlyTests,
}

export function generateStaticParams() {
  return blogPosts
    .filter((post) => post.slug in content || hasMarkdown(post.slug))
    .map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}

  // a post's own card lives at public/og/<slug>.png, otherwise the site card
  const image = fs.existsSync(path.join(process.cwd(), "public/og", `${slug}.png`)) ? `/og/${slug}.png` : "/og.png"
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      siteName: "Arshdeep Singh",
      type: "article",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  const Content = content[slug]
  const markdown = !Content && hasMarkdown(slug)

  if (!post || (!Content && !markdown)) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <article className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <BlogHeader post={post} />
          {markdown ? <MarkdownPost slug={slug} /> : <Content />}
          {markdown && process.env.NODE_ENV === "development" && <LiveDraft slug={slug} />}
        </div>
      </article>

      <ToTop />
      <Footer />
    </main>
  )
}
