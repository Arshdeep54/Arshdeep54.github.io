"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { projects } from "@/lib/data"

export default function FeaturedProjects() {
  const featured = projects.slice(0, 3)

  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-light text-foreground mb-2">Featured Projects</h2>
          <p className="text-muted-foreground">Highlighted work across professional, personal, and open-source</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featured.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => {
                const event = new CustomEvent("openProjectDetail", { detail: project })
                window.dispatchEvent(event)
              }}
            >
              <div className="bg-card border border-border p-6 rounded-lg hover:border-accent transition-colors h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                    {project.name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">{project.category}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs text-accent">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          href="/projects"
          className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2"
        >
          View all projects →
        </Link>
      </div>
    </section>
  )
}
