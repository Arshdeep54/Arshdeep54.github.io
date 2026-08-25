"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ExperienceDetail from "@/components/experience-detail"
import { experiences } from "@/lib/data"
import type { Experience } from "@/lib/data"

export default function ExperiencePage() {
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
              {experiences.length} roles
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
              Experience
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
              Professional roles, mentorships, and open-source communities.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-10 pl-8 sm:pl-12">
              {experiences.map((exp, idx) => (
                <motion.button
                  key={exp.id}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedExp(exp)}
                  className="group relative text-left w-full"
                >
                  <span className="absolute -left-8 sm:-left-12 top-1.5 h-2.5 w-2.5 rounded-full border border-accent bg-background group-hover:bg-accent transition-colors" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground group-hover:text-accent transition-colors">
                      {exp.role}
                    </h2>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-accent">
                    {exp.link ? (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline underline-offset-2"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                  </p>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedExp && (
        <ExperienceDetail experience={selectedExp} onClose={() => setSelectedExp(null)} />
      )}

      <Footer />
    </main>
  )
}
