"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--mercury-bg))] via-[hsl(var(--mercury-bg))] to-[hsl(var(--mercury-surface))]" />

      {/* Subtle animated gradient orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-[hsl(var(--mercury-accent))]/5 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-[hsl(var(--mercury-accent-2))]/5 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-radial from-[hsl(var(--mercury-warm))]/3 to-transparent rounded-full blur-2xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--mercury-text-subtle)) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
