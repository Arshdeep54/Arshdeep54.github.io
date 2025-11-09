"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { Experience } from "@/lib/data"

interface ExperienceDetailProps {
  experience: Experience
  onClose: () => void
}

export default function ExperienceDetail({ experience, onClose }: ExperienceDetailProps) {
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
          className="w-full max-w-2xl bg-card border-t border-border p-8 rounded-t-lg"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-light text-foreground mb-1">{experience.role}</h2>
              <p className="text-accent text-lg font-medium">{experience.company}</p>
              <p className="text-muted-foreground text-sm mt-2">{experience.duration}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{experience.description}</p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-3">Key Highlights</h3>
              <ul className="space-y-2">
                {experience.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {experience.skills.map((skill) => (
                  <span key={skill} className="text-sm text-accent px-3 py-1 bg-accent/10 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
