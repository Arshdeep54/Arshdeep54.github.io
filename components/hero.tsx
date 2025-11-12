"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="pt-20 sm:pt-32 pb-10 sm:pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center md:justify-between"
        >
          {/* Profile Picture - Centered on mobile, smaller size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto md:mx-0 order-1 md:order-2"
          >
            <Image
              src="/memoji.webp"
              alt="Arshdeep Singh"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 320px"
            />
          </motion.div>

          {/* Text Content */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 order-2 md:order-1 text-center md:text-left">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-2 sm:mb-3 md:mb-4 text-foreground">Arshdeep Singh</h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-light italic">Building systems that matter</p>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
              Pre-final year undergraduate at IIT Roorkee with an interest in databases, cryptography, and web
              development. Passionate about open-source software, low-level internals, and exploring blockchain and
              DevOps.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center md:justify-start">
              <Link
                href="/projects"
                className="px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-center border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                View Projects
              </Link>
              <Link 
                href="/experience" 
                className="px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-center text-accent hover:text-accent/80 transition-colors"
              >
                Experience
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
