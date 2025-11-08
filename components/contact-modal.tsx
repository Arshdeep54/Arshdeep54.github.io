"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Smartphone, Github, Linkedin } from "lucide-react"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setEmail("")
      setSubmitted(false)
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-border p-8 rounded-lg"
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-light text-foreground">Get in Touch</h2>
              <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
                <X size={20} />
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-border rounded bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    placeholder="Your message here..."
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity font-medium"
                >
                  Send Message
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Thanks for reaching out! I'll get back to you soon.</p>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-medium text-foreground mb-4">Direct Contact</h3>
              <div className="space-y-3">
                <a
                  href="mailto:arsh9bl998@gmail.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail size={18} />
                  <span className="text-sm">arsh9bl998@gmail.com</span>
                </a>
                <a
                  href="tel:+919855757833"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Smartphone size={18} />
                  <span className="text-sm">+91 9855757833</span>
                </a>
                <a
                  href="https://github.com/Arshdeep54"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github size={18} />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/arshdeep-singh-326815292"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin size={18} />
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
