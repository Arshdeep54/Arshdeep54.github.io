"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-30 flex h-8 w-8 items-center justify-center rounded border border-border bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
    >
      <ArrowUp size={15} />
    </button>
  )
}
