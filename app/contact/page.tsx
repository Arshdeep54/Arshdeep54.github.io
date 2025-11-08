"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Have a question or want to collaborate? Feel free to reach out.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Email</h3>
                  <a href="mailto:arsh9bl998@gmail.com" className="text-accent hover:text-accent/80 transition-colors">
                    arsh9bl998@gmail.com
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Social</h3>
                  <div className="space-y-2">
                    <a
                      href="https://github.com/Arshdeep54"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-accent hover:text-accent/80 transition-colors"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://linkedin.com/in/arshdeep-singh-326815292"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-accent hover:text-accent/80 transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                    placeholder="Your name"
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
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                    placeholder="your@email.com"
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
                    rows={5}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  {submitted ? "Message sent!" : "Send Message"}
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
