"use client"

import Modal, { Bullets, Field, Tags } from "@/components/modal"
import { experienceIcon } from "@/lib/icons"
import type { Experience } from "@/lib/data"

export default function ExperienceDetail({
  experience,
  onClose,
}: {
  experience: Experience
  onClose: () => void
}) {
  const Icon = experienceIcon(experience.id)

  return (
    <Modal
      onClose={onClose}
      header={
        <>
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-muted/60 text-muted-foreground">
              <Icon size={13} />
            </span>
            <h2 className="text-sm text-foreground">{experience.role}</h2>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {experience.link ? (
              <a
                href={experience.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-accent transition-colors"
              >
                {experience.company}
              </a>
            ) : (
              <span className="text-foreground">{experience.company}</span>
            )}{" "}
            · {experience.duration}
          </p>
        </>
      }
    >
      <Field label="About">
        <p className="text-muted-foreground leading-relaxed">
          {experience.description}
        </p>
      </Field>

      <Field label="Highlights">
        <Bullets items={experience.highlights} />
      </Field>

      <Field label="Skills">
        <Tags items={experience.skills} />
      </Field>
    </Modal>
  )
}
