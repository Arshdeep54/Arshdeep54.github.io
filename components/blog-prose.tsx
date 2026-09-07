import type { ReactNode } from "react"

export function Lede({ children }: { children: ReactNode }) {
  return (
    <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-2xl">
      {children}
    </p>
  )
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-14 mb-4 text-xl sm:text-2xl font-medium tracking-tight text-balance">
      {children}
    </h2>
  )
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-base text-muted-foreground leading-relaxed mb-5 max-w-2xl">
      {children}
    </p>
  )
}

export function Pull({ children }: { children: ReactNode }) {
  return (
    <p className="text-base sm:text-lg border-l-2 border-border pl-5 my-8 max-w-xl text-foreground">
      {children}
    </p>
  )
}

export function Note({
  label,
  tone = "accent",
  children,
}: {
  label: string
  tone?: "accent" | "chart-3"
  children: ReactNode
}) {
  const borderColor = tone === "accent" ? "border-foreground/60" : "border-foreground/25"
  const labelColor = tone === "accent" ? "text-foreground" : "text-muted-foreground"
  return (
    <div className={`flex gap-4 border-l-2 ${borderColor} bg-card rounded-sm p-4 my-6`}>
      <span className={`text-xs ${labelColor} whitespace-nowrap pt-0.5`}>
        {label}
      </span>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  )
}

export function Fig({
  caption,
  children,
}: {
  caption: string
  children: ReactNode
}) {
  return (
    <figure className="my-8 rounded border border-border bg-card p-5 sm:p-6">
      <div className="overflow-x-auto">{children}</div>
      <figcaption className="mt-4 pt-3 border-t border-dashed border-border font-mono text-xs text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}

export function CodePanel({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="my-6 rounded border border-border bg-card text-foreground p-5 font-mono text-[12.5px] sm:text-sm leading-relaxed overflow-x-auto">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <pre className="whitespace-pre">{children}</pre>
    </div>
  )
}

export function Table({
  head,
  rows,
}: {
  head: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="text-left text-xs text-muted-foreground bg-card border border-border px-3 py-2"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="align-top border border-border px-3 py-2.5 text-muted-foreground"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Closing({ children }: { children: ReactNode }) {
  return (
    <p className="text-base text-foreground leading-relaxed mb-5 max-w-2xl">
      {children}
    </p>
  )
}

export function Sources({
  items,
  heading = "Further reading",
}: {
  items: { label: string; href: string }[]
  heading?: string
}) {
  return (
    <div className="mt-16 pt-6 border-t border-border">
      <p className="text-xs text-muted-foreground mb-4">
        {heading}
      </p>
      <ol className="space-y-2 list-decimal list-inside">
        {items.map((s) => (
          <li key={s.href} className="text-sm text-muted-foreground">
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors underline decoration-accent/40 underline-offset-2"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
