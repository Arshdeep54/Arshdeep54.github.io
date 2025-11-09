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
  // Prevent body scroll when modal is open
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
        className="fixed inset-0 bg-black/50 z-50 flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-card border-t border-border rounded-t-lg flex flex-col max-h-[90vh] md:max-h-[85vh]"
        >
          {/* Fixed Header */}
          <div className="flex items-start justify-between p-6 pb-4 border-b border-border flex-shrink-0">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-2">{project.name}</h2>
              <div className="flex flex-wrap gap-2">
                {project.category.map((cat) => (
                  <span key={cat} className="text-accent text-xs sm:text-sm px-2 py-1 bg-accent/10 rounded">{cat}</span>
                ))}
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-muted rounded transition-colors flex-shrink-0 sticky top-0"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 px-6 py-6">
            <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">Overview</h3>
              <div className="text-muted-foreground leading-relaxed">
                {project.longDescription.includes("- ") || project.longDescription.includes("* ") ? (
                  <ul className="list-disc list-inside space-y-2">
                    {project.longDescription
                      .split(/\n/)
                      .filter((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "))
                      .map((line, idx) => (
                        <li key={idx} className="ml-2">
                          {line.replace(/^[-*]\s+/, "")}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p>{project.longDescription}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="text-sm text-accent px-3 py-1 bg-accent/10 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">Timeline</h3>
              <p className="text-muted-foreground">{project.date}</p>
            </div>

            <div className="flex gap-4 pt-4">
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors rounded"
                >
                  <Github size={18} />
                  GitHub
                </a>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 border border-muted text-muted-foreground rounded cursor-default">
                  <Lock size={18} />
                  Private repo
                </div>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors rounded"
                >
                  <ExternalLink size={18} />
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
