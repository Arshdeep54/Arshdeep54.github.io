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

      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-light mb-3 sm:mb-4 text-foreground">Experience</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Professional journey and roles</p>
          </div>

          {/* Timeline */}
          <div className="space-y-4 sm:space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedExp(exp)}
                className="group cursor-pointer"
              >
                <div className="bg-card border border-border p-4 sm:p-6 rounded-lg hover:border-accent hover:shadow-sm transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <div>
                      <h3 className="font-medium text-sm sm:text-base text-foreground group-hover:text-accent transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-xs sm:text-sm text-accent mt-1">{exp.company}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{exp.duration}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="text-xs text-accent px-2 py-1 bg-accent/5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedExp && <ExperienceDetail experience={selectedExp} onClose={() => setSelectedExp(null)} />}

      <Footer />
    </main>
  )
}
