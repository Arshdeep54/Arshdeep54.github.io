"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Github, Lock } from "lucide-react"
import type { Project } from "@/lib/data"
import { useEffect } from "react"

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
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
                {project.date}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                {project.name}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.category.map((cat) => (
                  <span
                    key={cat}
                    className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                  >
                    {cat}
                  </span>
                ))}
              </div>
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
                  Overview
                </p>
                <div className="text-muted-foreground leading-relaxed">
                  {project.longDescription.includes("- ") || project.longDescription.includes("* ") ? (
                    <ul className="space-y-2.5">
                      {project.longDescription
                        .split(/\n/)
                        .filter((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "))
                        .map((line, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-accent mt-1.5">•</span>
                            <span>{line.replace(/^[-*]\s+/, "")}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p>{project.longDescription}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs uppercase tracking-wider text-accent px-3 py-1.5 border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-accent-foreground bg-accent hover:opacity-90 transition-opacity"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-muted-foreground border border-border">
                    <Lock size={16} />
                    Private
                  </div>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-foreground border border-border hover:border-accent transition-colors"
                  >
                    <ExternalLink size={16} />
                    Visit
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
