"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { experienceIcon } from "@/lib/icons"
import { experiences } from "@/lib/data"

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-[46rem] px-6 pt-28 pb-16">
        <h1 className="text-sm text-foreground">Experience</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl leading-relaxed">
          Professional roles, mentorships, and open-source communities.
        </p>

        <div className="mt-10 border-t border-border">
          {experiences.map((exp) => {
            const Icon = experienceIcon(exp.id)
            return (
              <section
                key={exp.id}
                className="py-6 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-muted/60 text-muted-foreground">
                    <Icon size={13} />
                  </span>
                  <h2 className="text-sm text-foreground">{exp.role}</h2>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {exp.link ? (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-accent transition-colors"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    <span className="text-foreground">{exp.company}</span>
                  )}{" "}
                  · {exp.duration}
                </p>

                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>

                <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-4 marker:text-muted-foreground/40">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs text-muted-foreground px-2.5 py-1 border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      <Footer />
    </main>
  )
}
