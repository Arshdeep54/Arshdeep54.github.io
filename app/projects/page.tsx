"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ProjectDetail from "@/components/project-detail"
import { projects } from "@/lib/data"
import type { Project } from "@/lib/data"

const categories = ["all", "Professional", "Personal", "Open Source"] as const

export default function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category.includes(filter))

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
              {projects.length} projects
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
              Projects
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
              Systems work, open-source contributions, and experiments across
              databases, cryptography, and the web.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10 border-b border-border pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-mono text-xs uppercase tracking-widest pb-1 -mb-px transition-colors ${
                  filter === cat
                    ? "text-foreground border-b border-accent"
                    : "text-muted-foreground hover:text-foreground border-b border-transparent"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          <div className="divide-y divide-border border-y border-border">
            <AnimatePresence initial={false}>
              {filtered.map((project, idx) => (
                <motion.button
                  key={project.id}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => setSelectedProject(project)}
                  className="group grid grid-cols-[auto_1fr_auto] gap-4 sm:gap-8 items-baseline py-6 sm:py-8 text-left w-full hover:bg-card/50 transition-colors px-1 -mx-1"
                >
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground group-hover:text-accent transition-colors">
                        {project.name}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {project.date}
                      </span>
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tech.slice(0, 4).map((t) => (
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
                    →
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {selectedProject && (
        <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      <Footer />
    </main>
  )
}
