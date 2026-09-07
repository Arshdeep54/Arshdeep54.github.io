"use client"

import { ExternalLink, Github, Lock } from "lucide-react"
import Modal, { Bullets, Field, Tags } from "@/components/modal"
import { projectIcon } from "@/lib/icons"
import type { Project } from "@/lib/data"

const bullets = (text: string) =>
  text
    .split("\n")
    .filter((line) => /^\s*[-*]\s+/.test(line))
    .map((line) => line.replace(/^\s*[-*]\s+/, ""))

export default function ProjectDetail({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const Icon = projectIcon(project.id)
  const items = bullets(project.longDescription)

  return (
    <Modal
      onClose={onClose}
      header={
        <>
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-muted/60 text-muted-foreground">
              <Icon size={13} />
            </span>
            <h2 className="text-sm text-foreground">{project.name}</h2>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {project.date} · {project.category.join(", ")}
          </p>
        </>
      }
    >
      <Field label="Overview">
        {items.length ? (
          <Bullets items={items} />
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            {project.longDescription}
          </p>
        )}
      </Field>

      <Field label="Stack">
        <Tags items={project.tech} />
      </Field>

      <div className="flex gap-3 pt-1">
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-foreground border border-border hover:border-accent transition-colors"
          >
            <Github size={15} />
            GitHub
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border border-border">
            <Lock size={15} />
            Private
          </span>
        )}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-foreground border border-border hover:border-accent transition-colors"
          >
            <ExternalLink size={15} />
            Visit
          </a>
        )}
      </div>
    </Modal>
  )
}
