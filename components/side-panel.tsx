"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

// "For the curious" asides: a PanelLink opens the Panel with the same id.
// Right-side drawer on desktop, bottom sheet on phones.
const PanelContext = createContext<{ open: string | null; setOpen: (id: string | null) => void }>({
  open: null,
  setOpen: () => {},
})

export function SidePanels({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<string | null>(null)
  return <PanelContext.Provider value={{ open, setOpen }}>{children}</PanelContext.Provider>
}

export function PanelLink({ id, children }: { id: string; children: ReactNode }) {
  const { setOpen } = useContext(PanelContext)
  return (
    <a
      href={`#note-${id}`}
      role="button"
      aria-haspopup="dialog"
      onClick={(e) => {
        e.preventDefault()
        setOpen(id)
      }}
      className="underline decoration-dotted decoration-accent underline-offset-4 hover:text-accent transition-colors"
    >
      {children}
    </a>
  )
}

export function Panel({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const { open, setOpen } = useContext(PanelContext)
  const isOpen = open === id
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const back = document.activeElement as HTMLElement | null
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null)
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = "unset"
      document.removeEventListener("keydown", onKey)
      back?.focus()
    }
  }, [isOpen, setOpen])

  // only read once it's open, which is always in the browser
  const hidden = isOpen && window.matchMedia("(min-width: 640px)").matches ? { x: "100%" } : { y: "100%" }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/40"
          onClick={() => setOpen(null)}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={`panel-${id}`}
            initial={hidden}
            animate={{ x: 0, y: 0 }}
            exit={hidden}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col border-t border-border bg-card sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[560px] sm:border-t-0 sm:border-l"
          >
            <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-border sm:hidden" />
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-border shrink-0">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">For the curious</p>
                <h2 id={`panel-${id}`} className="text-lg font-medium tracking-tight">{title}</h2>
              </div>
              <button
                ref={closeRef}
                onClick={() => setOpen(null)}
                className="-mr-2 p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain flex-1 px-6 py-6">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
