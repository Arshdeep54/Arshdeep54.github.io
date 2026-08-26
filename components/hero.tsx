"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-5"
        >
          Developer · IIT Roorkee
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-serif text-[clamp(4rem,12vw,11.5rem)] font-medium leading-[0.9] tracking-tight text-balance"
        >
          Arshdeep
          <br />
          Singh
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 sm:mt-14 flex items-center gap-6"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px flex-1 origin-left bg-border"
          />
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            N.&deg; 01 &mdash; Roorkee, IN
          </span>
        </motion.div>

        <div className="mt-8 sm:mt-10 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            I build low-level systems with a database instinct: storage engines,
            indexers, and backend services. Final-year undergraduate
            interested in databases, cryptography, and open-source internals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
          >
            <Link
              href="/projects"
              className="font-mono text-xs uppercase tracking-widest text-accent-foreground bg-accent px-5 py-3 hover:opacity-90 transition-opacity"
            >
              View projects
            </Link>
            <Link
              href="/experience"
              className="font-mono text-xs uppercase tracking-widest text-foreground border border-border px-5 py-3 hover:border-accent transition-colors"
            >
              Experience
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
