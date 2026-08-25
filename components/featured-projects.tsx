"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import ProjectDetail from "@/components/project-detail"
import { projects } from "@/lib/data"
import type { Project } from "@/lib/data"

export default function FeaturedProjects() {
  const featured = projects.slice(0, 3)
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <>
    <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 sm:mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
              Selected work
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight">
              Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            All projects →
          </Link>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {featured.map((project, idx) => (
            <motion.button
              key={project.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => setSelected(project)}
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
              </div>
              <span className="font-mono text-xs text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent">
                →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
    {selected && (
      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    )}
    </>
  )
}
