"use client"

import { useEffect, useRef, useState } from "react"

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

// Neutral steps, so the grid reads as part of the page and not as GitHub green.
const levelClass = [
  "bg-muted",
  "bg-foreground/25",
  "bg-foreground/45",
  "bg-foreground/70",
  "bg-foreground",
]

export default function Contributions({ user }: { user: string }) {
  const [days, setDays] = useState<Day[] | null>(null)
  const [total, setTotal] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return
        setDays(data.contributions)
        setTotal(data.total.lastYear)
      })
      // A third-party feed being down is not worth an error state on a portfolio.
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user])

  // Narrow screens clip the grid: start at today, let the reader scroll back.
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [days])

  if (!days) return null

  // Pad so the first column starts on a Sunday, then fill columns top to bottom.
  const offset = new Date(days[0].date).getUTCDay()
  const cells: (Day | null)[] = [...Array(offset).fill(null), ...days]

  return (
    <section className="mt-14">
      <div className="flex items-baseline justify-between border-b border-border pb-2">
        <h2 className="text-xs text-muted-foreground">Contributions</h2>
        <a
          href={`https://github.com/${user}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-accent transition-colors"
        >
          {total.toLocaleString()} in the last year
        </a>
      </div>

      <div ref={scroller} className="mt-4 overflow-x-auto pb-1">
        <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-max">
          {cells.map((day, i) =>
            day ? (
              <span
                key={day.date}
                title={`${day.count} on ${day.date}`}
                className={`h-2.5 w-2.5 rounded-[2px] ${levelClass[day.level]}`}
              />
            ) : (
              <span key={`pad-${i}`} className="h-2.5 w-2.5" />
            )
          )}
        </div>
      </div>
    </section>
  )
}
