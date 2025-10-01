"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

export default function AnimatedFooter() {
  return (
    <motion.footer
      className="relative z-10 mt-16 py-12 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[hsl(var(--mercury-border))] to-transparent mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Project info */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div
              className="text-center md:text-left"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="font-display font-semibold text-foreground mb-1">
                Didiblunder
              </h3>
              <p className="text-sm mercury-text-muted">
                Humane chess analysis inspired by flow state
              </p>
            </motion.div>

            {/* Links */}
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com/VoKhuong/didiblunder"
                className="flex items-center gap-2 px-3 py-2 rounded-md mercury-surface mercury-shadow hover:mercury-shadow-lg transition-all duration-200 text-sm font-medium mercury-text-subtle hover:text-foreground group"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                <span className="hidden sm:inline">Source</span>
              </motion.a>

              <motion.a
                href="https://www.mercuryos.com/"
                className="flex items-center gap-2 px-3 py-2 rounded-md mercury-surface mercury-shadow hover:mercury-shadow-lg transition-all duration-200 text-sm font-medium mercury-text-subtle hover:text-foreground group"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                <span className="hidden sm:inline">Mercury OS</span>
              </motion.a>
            </div>
          </div>

          {/* Right side - Design attribution */}
          <div className="text-center md:text-right">
            <p className="text-xs mercury-text-muted">
              Design inspired by{" "}
              <motion.span
                className="font-medium text-[hsl(var(--mercury-accent))]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Mercury OS
              </motion.span>
            </p>
            <p className="text-xs mercury-text-muted mt-1">
              Humane computing for flow state
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t border-[hsl(var(--mercury-border))]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs mercury-text-muted">
              © 2024 Didiblunder. Built with Next.js, Tailwind CSS, and
              shadcn/ui.
            </p>

            {/* Flow state indicator */}
            <motion.div
              className="flex items-center gap-2 text-xs mercury-text-muted"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[hsl(var(--mercury-accent))] to-[hsl(var(--mercury-accent-2))]" />
              <span>Flow state active</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
