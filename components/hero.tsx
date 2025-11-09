"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center md:justify-between"
        >
          {/* Text Content */}
          <div className="space-y-6 sm:space-y-8 order-2 md:order-1">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-3 sm:mb-4 text-foreground">Arshdeep Singh</h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-light italic">Building systems that matter</p>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Pre-final year undergraduate at IIT Roorkee with an interest in databases, cryptography, and web
              development. Passionate about open-source software, low-level internals, and exploring blockchain and
              DevOps.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link
                href="/projects"
                className="px-6 py-2.5 text-center border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                View Projects
              </Link>
              <Link 
                href="/experience" 
                className="px-6 py-2.5 text-center text-accent hover:text-accent/80 transition-colors"
              >
                Experience
              </Link>
            </div>
          </div>

          {/* Profile Picture - Centered on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto md:mx-0 rounded-full overflow-hidden border-2 border-accent/30 order-1 md:order-2"
          >
            <Image src="/profile.jpg" alt="Arshdeep Singh" fill className="object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
