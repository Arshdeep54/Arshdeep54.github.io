"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { experiences } from "@/lib/data"

export default function FeaturedExperiences() {
  const featured = experiences.slice(0, 3)

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-2">Experience</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Professional roles and open-source contributions</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {featured.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => {
                const event = new CustomEvent("openExperienceDetail", { detail: exp })
                window.dispatchEvent(event)
              }}
            >
              <div className="bg-card border border-border p-4 sm:p-6 rounded-lg hover:border-accent transition-colors h-full">
                <div className="mb-3">
                  <h3 className="font-medium text-sm sm:text-base text-foreground group-hover:text-accent transition-colors mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-xs sm:text-sm text-accent">{exp.company}</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">{exp.description}</p>
                <p className="text-xs text-muted-foreground">{exp.duration}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          href="/experience"
          className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2"
        >
          View all experience →
        </Link>
      </div>
    </section>
  )
}
