"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ExperienceDetail from "@/components/experience-detail"
import { Row, Section } from "@/components/list-row"
import { experienceIcon } from "@/lib/icons"
import { experiences } from "@/lib/data"
import type { Experience } from "@/lib/data"

export default function ExperiencePage() {
  const [selected, setSelected] = useState<Experience | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-[46rem] px-6 pt-28 pb-16">
        <h1 className="text-sm text-foreground">Experience</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl leading-relaxed">
          Professional roles, mentorships, and open-source communities.
        </p>

        <Section label={`${experiences.length} roles`}>
          {experiences.map((exp) => (
            <Row
              key={exp.id}
              when={exp.duration.match(/\d{4}/)?.[0] ?? ""}
              title={exp.role}
              icon={experienceIcon(exp.id)}
              meta={exp.company}
              description={exp.description}
              tags={exp.skills}
              onClick={() => setSelected(exp)}
            />
          ))}
        </Section>
      </div>

      {selected && (
        <ExperienceDetail experience={selected} onClose={() => setSelected(null)} />
      )}

      <Footer />
    </main>
  )
}
