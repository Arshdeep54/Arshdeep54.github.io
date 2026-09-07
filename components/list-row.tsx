"use client"

import Link from "next/link"
import { ArrowUpRight, FileText, type LucideIcon } from "lucide-react"

const rowClass =
  "group grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[3.5rem_1fr_auto_auto] gap-x-4 gap-y-1 items-baseline w-full py-3 px-2 -mx-2 text-left text-sm border-b border-border last:border-0 hover:bg-muted/50 transition-colors"

export function Row({
  when,
  title,
  icon: Icon,
  meta,
  description,
  tags,
  onClick,
  href,
  external,
}: {
  when: string
  title: string
  icon?: LucideIcon
  meta?: string
  description?: string
  tags?: string[]
  onClick?: () => void
  href?: string
  external?: boolean
}) {
  const body = (
    <>
      <span className="text-xs text-muted-foreground tabular-nums">{when}</span>
      <span className="flex items-center gap-2.5 text-foreground group-hover:text-accent transition-colors">
        {Icon && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-muted/60 text-muted-foreground">
            <Icon size={13} />
          </span>
        )}
        {title}
      </span>
      {meta && (
        <span className="col-start-2 sm:col-start-3 sm:text-right text-xs text-muted-foreground">
          {meta}
        </span>
      )}
      <ArrowUpRight
        size={14}
        className="row-start-1 col-start-3 sm:col-start-4 self-center text-muted-foreground/50 group-hover:text-accent transition-colors"
        aria-hidden
      />
      {(description || tags?.length) && (
        <span className="col-start-2 sm:col-span-2 text-xs leading-relaxed text-muted-foreground">
          {description}
          {tags?.length ? (
            <span className="block mt-1 text-muted-foreground/70">
              {tags.join(" · ")}
            </span>
          ) : null}
        </span>
      )}
    </>
  )

  return href ? (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={rowClass}
    >
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={rowClass}>
      {body}
    </button>
  )
}

export function Section({
  label,
  href,
  more,
  children,
}: {
  label: string
  href?: string
  more?: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-14">
      <div className="flex items-baseline justify-between border-b border-border pb-2">
        <h2 className="text-xs text-muted-foreground">{label}</h2>
        {href && (
          <Link
            href={href}
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            {more}
          </Link>
        )}
      </div>
      <div>{children}</div>
    </section>
  )
}


/** Writing reads as an article, not a ledger line: title over its own byline. */
export function PostRow({
  title,
  meta,
  href,
  external,
}: {
  title: string
  meta: string
  href: string
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-3 w-full py-3 px-2 -mx-2 text-sm border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
    >
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-muted/60 text-muted-foreground">
        <FileText size={13} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-foreground group-hover:text-accent transition-colors">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{meta}</span>
      </span>
      {external && (
        <ArrowUpRight
          size={14}
          className="mt-1 shrink-0 text-muted-foreground/50 group-hover:text-accent transition-colors"
          aria-hidden
        />
      )}
    </Link>
  )
}
