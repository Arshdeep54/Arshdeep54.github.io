"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Dev only: the writer tool (npm run write, port 4100) pings this on every save and we re-render the server page.
export default function LiveDraft({ slug }: { slug: string }) {
  const router = useRouter()

  useEffect(() => {
    const events = new EventSource(`http://localhost:4100/events?slug=${slug}`)
    events.onmessage = () => router.refresh()
    return () => events.close()
  }, [slug, router])

  return null
}
