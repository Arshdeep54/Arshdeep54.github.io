"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ProjectDetail from "@/components/project-detail"
import { projects } from "@/lib/data"
import type { Project } from "@/lib/data"

export default function ProjectsPage() {
  const [filter, setFilter] = useState<"all" | "Professional" | "Personal" | "Open Source">("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter)

  const categories: Array<"all" | "Professional" | "Personal" | "Open Source"> = [
    "all",
    "Professional",
    "Personal",
    "Open Source",
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-light mb-4 text-foreground">Projects</h1>
            <p className="text-muted-foreground">A collection of work across different domains and technologies</p>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded text-sm transition-all ${
                  filter === cat
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-card border border-border"
                }`}
              >
                {cat === "all" ? "All Projects" : cat}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {filtered.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer"
                >
                  <div className="bg-card border border-border p-6 rounded-lg hover:border-accent hover:shadow-sm transition-all h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                        {project.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground whitespace-nowrap ml-2">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs text-accent px-2 py-1 bg-accent/5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">{project.date}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}

      <Footer />
    </main>
  )
}
