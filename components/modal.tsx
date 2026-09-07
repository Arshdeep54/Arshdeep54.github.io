"use client"

import { useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

/** Shared shell for the project and experience detail sheets. */
export default function Modal({
  header,
  children,
  onClose,
}: {
  header: ReactNode
  children: ReactNode
  onClose: () => void
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = "unset"
      document.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center"
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-xl bg-card border-t sm:border border-border flex flex-col max-h-[90vh] sm:max-h-[85vh] sm:mx-4"
        >
          <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 pb-4 border-b border-border shrink-0">
            <div className="min-w-0 flex-1">{header}</div>
            <button
              onClick={onClose}
              className="-mr-2 -mt-1 p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 sm:px-8 py-6 space-y-7 text-sm">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2.5">{label}</p>
      {children}
    </div>
  )
}

/** Bullets from the data files, with `backticked` spans rendered as code. */
export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-4 marker:text-muted-foreground/40">
      {items.map((item, idx) => (
        <li key={idx}>
          {item.split(/`([^`]+)`/).map((part, i) =>
            i % 2 === 1 ? (
              <code key={i} className="font-mono text-[0.9em] text-foreground">
                {part}
              </code>
            ) : (
              part
            )
          )}
        </li>
      ))}
    </ul>
  )
}

export function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className="text-xs text-muted-foreground px-2.5 py-1 border border-border"
        >
          {t}
        </span>
      ))}
    </div>
  )
}
