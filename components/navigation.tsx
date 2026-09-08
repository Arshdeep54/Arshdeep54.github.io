"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/blogs", label: "Writing" },
  { href: "/contact", label: "Contact" },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-40 border-b border-border">
      <div className="max-w-[46rem] mx-auto px-6 h-16 flex items-center justify-between">
        {/* The home page prints the name in its own header; don't say it twice. */}
        {pathname === "/" ? (
          <span />
        ) : (
          <Link
            href="/"
            className="text-sm text-foreground hover:text-accent transition-colors"
          >
            Arshdeep Singh
          </Link>
        )}

        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm transition-colors ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-accent" />
                )}
              </Link>
            ))}
          </div>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Resume
          </a>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm">
          <div className="px-4 py-6 space-y-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm text-foreground hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
