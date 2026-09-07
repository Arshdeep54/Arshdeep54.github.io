import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import HomeIndex from "@/components/home-index"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  description:
    "Systems developer working on storage engines, indexers, and database internals.",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HomeIndex />
      <Footer />
    </main>
  )
}
