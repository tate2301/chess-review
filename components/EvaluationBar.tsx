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

  return (
    <div
      className={cn(
        "relative w-6 flex flex-col h-full bg-input border-border",
        className,
      )}
    >
      {isMate ? (
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <motion.div
          className="absolute bottom-0 left-0 w-full h-full bg-white py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, height: `${barHeight * 100}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="relative h-full flex justify-center items-end">
            {isPositive && (
              <p className="text-center text-xs">+{evaluation.score / 100}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
