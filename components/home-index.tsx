"use client"

import { useState } from "react"
import Link from "next/link"
import Contributions from "@/components/contributions"
import { PostRow, Row, Section } from "@/components/list-row"
import { experienceIcon, projectIcon } from "@/lib/icons"
import ProjectDetail from "@/components/project-detail"
import ExperienceDetail from "@/components/experience-detail"
import { projects, experiences, blogPosts } from "@/lib/data"
import type { Project, Experience } from "@/lib/data"

// Dates read like "Aug 2026 - Present" or "Mar 2026".
const year = (d: string) => d.match(/\d{4}/)?.[0] ?? ""

export default function HomeIndex() {
  const [project, setProject] = useState<Project | null>(null)
  const [experience, setExperience] = useState<Experience | null>(null)

  // Curated by hand: the second Protocol Labs cohort repeats the first, SDSLabs doesn't.
  const featuredRoles = [
    "tal-boss-software-engineer",
    "lfx-wasmedge",
    "pldg-cohort-4",
    "sds-labs-dev",
  ]
    .map((id) => experiences.find((e) => e.id === id))
    .filter((e) => e !== undefined)

  // The curated five, newest first: the raw order made the year column look random.
  const featured = projects
    .slice(0, 5)
    .sort(
      (a, b) =>
        new Date(b.date.split(" - ")[0]).getTime() -
        new Date(a.date.split(" - ")[0]).getTime()
    )

  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <>
      <div className="mx-auto max-w-[46rem] px-6 pt-28 pb-16">
        <header>
          <h1 className="text-sm text-foreground">Arshdeep Singh</h1>
          <p className="text-sm text-muted-foreground">Databases, systems, backend</p>
        </header>

        <div className="mt-8 text-sm leading-relaxed text-muted-foreground">
          <p>
            Final-year undergraduate at{" "}
            <span className="text-foreground">IIT Roorkee</span>. I build
            low-level systems with a database instinct: storage engines,
            indexers, and the backend services around them, mostly in{" "}
            <span className="text-foreground">Rust</span>.
            What holds my attention is the layer underneath: how systems
            behave when things go wrong, and how the software everyone depends
            on actually works inside.
          </p>
        </div>

        <Contributions user="Arshdeep54" />

        <Section label="Experience" href="/experience" more="All roles">
          {featuredRoles.map((exp) => (
            <Row
              key={exp.id}
              when={year(exp.duration)}
              title={exp.role}
              icon={experienceIcon(exp.id)}
              meta={exp.company}
              onClick={() => setExperience(exp)}
            />
          ))}
        </Section>

        <Section label="Featured work" href="/projects" more="All projects">
          {featured.map((p) => (
            <Row
              key={p.id}
              when={year(p.date)}
              title={p.name}
              icon={projectIcon(p.id)}
              meta={p.tagline ?? p.category.join(" · ")}
              onClick={() => setProject(p)}
            />
          ))}
        </Section>

        <Section label="Writing" href="/blogs" more="All posts">
          {posts.map((post) => (
            <PostRow
              key={post.slug}
              title={post.title}
              meta={[post.date, post.externalUrl ? post.source : post.readingTime]
                .filter(Boolean)
                .join(" · ")}
              href={post.externalUrl ?? `/blog/${post.slug}`}
              external={Boolean(post.externalUrl)}
            />
          ))}
        </Section>
      </div>

      {project && <ProjectDetail project={project} onClose={() => setProject(null)} />}
      {experience && (
        <ExperienceDetail experience={experience} onClose={() => setExperience(null)} />
      )}
    </>
  )
}
