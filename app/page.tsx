import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import FeaturedProjects from "@/components/featured-projects"
import FeaturedExperiences from "@/components/featured-experiences"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Arshdeep Singh - Home",
  description: "Developer passionate about databases, cryptography, and web development",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <FeaturedExperiences />
      <FeaturedProjects />
      <Footer />
    </main>
  )
}
