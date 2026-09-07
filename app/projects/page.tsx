"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ProjectDetail from "@/components/project-detail"
import { Row, Section } from "@/components/list-row"
import { projectIcon } from "@/lib/icons"
import { projects } from "@/lib/data"
import type { Project } from "@/lib/data"

const categories = ["all", "Professional", "Personal", "Open Source"] as const

export default function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("all")
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category.includes(filter))

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-[46rem] px-6 pt-28 pb-16">
        <h1 className="text-sm text-foreground">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl leading-relaxed">
          Systems work, open-source contributions, and experiments across
          databases, cryptography, and the web.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-sm transition-colors ${
                filter === cat
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        <Section label={`${filtered.length} projects`}>
          {filtered.map((project) => (
            <Row
              key={project.id}
              when={project.date.match(/\d{4}/)?.[0] ?? ""}
              title={project.name}
              icon={projectIcon(project.id)}
              meta={project.category.join(" · ")}
              description={project.description}
              tags={project.tech.slice(0, 5)}
              onClick={() => setSelected(project)}
            />
          ))}
        </Section>
      </div>

      {selected && (
        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      )}

      <Footer />
    </main>
  )
}
