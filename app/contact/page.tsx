"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", honeypot: "" })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", message: "", honeypot: "" })
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    "w-full px-4 py-3 text-base sm:text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
              Contact
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
              Get in touch
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
              Have a question or want to collaborate? I usually reply within a
              day.
            </p>

            <div className="mt-12 grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16">
              <div className="space-y-8">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                    Email
                  </p>
                  <a
                    href="mailto:arsh9bl998@gmail.com"
                    className="text-base text-foreground hover:text-accent transition-colors break-all"
                  >
                    arsh9bl998@gmail.com
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                    Elsewhere
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://github.com/Arshdeep54"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-base text-muted-foreground hover:text-accent transition-colors"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://linkedin.com/in/arshdeep-singh-326815292"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-base text-muted-foreground hover:text-accent transition-colors"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://x.com/arshdeez_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-base text-muted-foreground hover:text-accent transition-colors"
                    >
                      X
                    </a>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px" }}
                  aria-hidden="true"
                />

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className={inputClass}
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    className={inputClass}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={2000}
                    rows={6}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell me about the project, role, or idea."
                    disabled={isSubmitting}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {submitted && (
                  <div className="p-4 bg-accent/10 border border-accent/20">
                    <p className="text-sm text-accent">
                      Thanks for reaching out. I&apos;ll get back to you soon.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="w-full sm:w-auto px-6 py-3 font-mono text-xs uppercase tracking-widest bg-accent text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : submitted ? "Sent" : "Send message"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
