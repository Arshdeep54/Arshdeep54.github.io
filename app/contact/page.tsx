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
    // Clear error when user starts typing
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

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-foreground mb-3 sm:mb-4">Get in Touch</h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12">
              Have a question or want to collaborate? Feel free to reach out.
            </p>

            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12">
              {/* Contact Info */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-medium text-sm sm:text-base text-foreground mb-2">Email</h3>
                  <a href="mailto:arsh9bl998@gmail.com" className="text-sm sm:text-base text-accent hover:text-accent/80 transition-colors break-all">
                    arsh9bl998@gmail.com
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-sm sm:text-base text-foreground mb-2">Social</h3>
                  <div className="space-y-2">
                    <a
                      href="https://github.com/Arshdeep54"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm sm:text-base text-accent hover:text-accent/80 transition-colors"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://linkedin.com/in/arshdeep-singh-326815292"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm sm:text-base text-accent hover:text-accent/80 transition-colors"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://x.com/Arsh_bal_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm sm:text-base text-accent hover:text-accent/80 transition-colors"
                    >
                      X
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full px-4 py-2.5 text-sm sm:text-base bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
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
                    className="w-full px-4 py-2.5 text-sm sm:text-base bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                    placeholder="your@email.com"
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
                    rows={5}
                    className="w-full px-4 py-2.5 text-sm sm:text-base bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
                    placeholder="Your message..."
                    disabled={isSubmitting}
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                
                {submitted && (
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-sm text-accent">Thanks for reaching out! I'll get back to you soon.</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="w-full px-6 py-3 text-sm sm:text-base bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : submitted ? "Message sent!" : "Send Message"}
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
