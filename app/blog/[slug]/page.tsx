import { notFound } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import BlogHeader from "@/components/blog-header"
import { blogPosts } from "@/lib/data"
import TwoParsersOneStream from "@/components/blog-posts/two-parsers-one-stream"
import LedgerPattern from "@/components/blog-posts/ledger-pattern"

const content: Record<string, React.ComponentType> = {
  "two-parsers-one-stream": TwoParsersOneStream,
  "ledger-pattern": LedgerPattern,
}

export function generateStaticParams() {
  return blogPosts
    .filter((post) => post.slug in content)
    .map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  const Content = content[slug]

  if (!post || !Content) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <article className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <BlogHeader post={post} />
          <Content />
        </div>
      </article>

      <Footer />
    </main>
  )
}
