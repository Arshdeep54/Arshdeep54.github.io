"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { Experience } from "@/lib/data"
import { useEffect } from "react"

interface ExperienceDetailProps {
  experience: Experience
  onClose: () => void
}

export default function ExperienceDetail({ experience, onClose }: ExperienceDetailProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-2xl bg-card border-t sm:border border-border flex flex-col max-h-[90vh] sm:max-h-[85vh] sm:mx-4"
        >
          <div className="flex items-start justify-between p-6 sm:p-8 pb-4 border-b border-border flex-shrink-0">
            <div className="flex-1 pr-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-2">
                {experience.duration}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                {experience.role}
              </h2>
              <p className="mt-2 text-base text-accent">
                {experience.link ? (
                  <a
                    href={experience.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-2"
                  >
                    {experience.company}
                  </a>
                ) : (
                  experience.company
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 sm:px-8 py-6">
            <div className="space-y-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                  About
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                  Highlights
                </p>
                <ul className="space-y-2.5">
                  {experience.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-accent mt-1.5">•</span>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {experience.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-xs uppercase tracking-wider text-accent px-3 py-1.5 border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
