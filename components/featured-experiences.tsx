"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import ExperienceDetail from "@/components/experience-detail"
import { experiences } from "@/lib/data"
import type { Experience } from "@/lib/data"

export default function FeaturedExperiences() {
  const featured = experiences.slice(0, 3)
  const [selected, setSelected] = useState<Experience | null>(null)

  return (
    <>
    <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 sm:mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
              Career
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight">
              Experience
            </h2>
          </div>
          <Link
            href="/experience"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            All roles →
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-px bg-border border border-border">
          {featured.map((exp, idx) => (
            <motion.button
              key={exp.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => setSelected(exp)}
              className="group flex flex-col justify-between bg-background p-6 sm:p-8 text-left hover:bg-card/50 transition-colors"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
                  {exp.duration}
                </p>
                <h3 className="font-serif text-xl font-medium tracking-tight text-foreground group-hover:text-accent transition-colors">
                  {exp.role}
                </h3>
                <p className="mt-2 text-sm text-accent">
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
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>
              <span className="mt-8 font-mono text-xs text-muted-foreground group-hover:text-accent transition-colors">
                Read more →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
    {selected && (
      <ExperienceDetail experience={selected} onClose={() => setSelected(null)} />
    )}
    </>
  )
}
