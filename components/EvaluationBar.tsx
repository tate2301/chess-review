"use client";

import { motion } from "framer-motion";
import { toEvaluationHeight } from "../lib/evaluation";
import type { Evaluation } from "../types/Evaluation";
import { cn } from "../lib/utils";
import Label from "../types/Label";

interface EvaluationBarProps {
  evaluation: Evaluation;
  className?: string;
}

export default function EvaluationBar({
  evaluation,
  className,
}: EvaluationBarProps) {
  const barHeight = toEvaluationHeight(evaluation);
  const isPositive = evaluation.score > 0;
  const isMate = evaluation.type === "mate";

  // Mercury-inspired color mapping for different evaluation types
  const getEvaluationColor = (label: Label) => {
    switch (label) {
      case Label.BRILLIANT:
        return "from-teal-400 to-teal-600";
      case Label.GREAT:
        return "from-blue-400 to-blue-600";
      case Label.BEST:
        return "from-emerald-400 to-emerald-600";
      case Label.EXCELLENT:
        return "from-lime-400 to-lime-600";
      case Label.GOOD:
        return "from-green-400 to-green-600";
      case Label.BOOK:
        return "from-stone-400 to-stone-600";
      case Label.INACCURACY:
        return "from-yellow-400 to-yellow-600";
      case Label.MISTAKE:
        return "from-orange-400 to-orange-600";
      case Label.BLUNDER:
        return "from-red-400 to-red-600";
      case Label.MISSED:
        return "from-pink-400 to-pink-600";
      case Label.CHECKMATE:
        return "from-purple-600 to-purple-800";
      default:
        return "from-[hsl(var(--mercury-accent))] to-[hsl(var(--mercury-accent-2))]";
    }
  };

  const gradientClass = getEvaluationColor(evaluation.label);

  return (
    <div
      className={cn("relative w-6 flex flex-col", className)}
      style={{ height: "min(70vh, 600px)" }}
    >
      {/* Background container */}
      <div className="relative flex-1 rounded-lg overflow-hidden mercury-surface border-2 border-[hsl(var(--mercury-border))] bg-gradient-to-b from-[hsl(var(--mercury-surface))] to-[hsl(var(--mercury-surface-elevated))]">
        {/* Center line indicator */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-[hsl(var(--mercury-border-strong))] z-10">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[hsl(var(--mercury-text-muted))] border border-[hsl(var(--mercury-border-strong))]" />
        </div>

        {/* White advantage section (top half) */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/90 to-white/70">
          {isPositive && (
            <motion.div
              className={cn(
                "absolute inset-x-0 bottom-0 bg-gradient-to-t",
                gradientClass,
                "shadow-inner",
              )}
              style={{ height: `${Math.min(barHeight * 2, 1) * 100}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.min(barHeight * 2, 1) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Shimmer effect for brilliant moves */}
              {evaluation.label === Label.BRILLIANT && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Black advantage section (bottom half) */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-800/90 to-slate-800/70">
          {!isPositive && (
            <motion.div
              className={cn(
                "absolute inset-x-0 top-0 bg-gradient-to-b",
                gradientClass,
                "shadow-inner",
              )}
              style={{ height: `${Math.min((1 - barHeight) * 2, 1) * 100}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.min((1 - barHeight) * 2, 1) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Shimmer effect for brilliant moves */}
              {evaluation.label === Label.BRILLIANT && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Mate indicator */}
        {isMate && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-purple-600/80 to-purple-800/80 border border-purple-500/50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-white font-bold text-xs transform rotate-90"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                #
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Glow effect for critical positions */}
        {[Label.BRILLIANT, Label.BLUNDER, Label.CHECKMATE].includes(
          evaluation.label,
        ) && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-lg blur-sm opacity-30",
              gradientClass.includes("teal") && "shadow-teal-400/50",
              gradientClass.includes("red") && "shadow-red-400/50",
              gradientClass.includes("purple") && "shadow-purple-400/50",
            )}
            animate={{
              boxShadow: [
                "0 0 0px rgba(0,0,0,0)",
                "0 0 20px currentColor",
                "0 0 0px rgba(0,0,0,0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Position indicator labels */}
      <div className="mt-2 text-center space-y-1">
        <div className="text-xs font-mono mercury-text-subtle">
          {isPositive ? "+" : ""}
          {isMate
            ? `M${Math.abs(evaluation.score)}`
            : (evaluation.score / 100).toFixed(1)}
        </div>

        {/* Flow state indicator */}
        <motion.div
          className="w-1 h-1 mx-auto rounded-full bg-[hsl(var(--mercury-accent))]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
