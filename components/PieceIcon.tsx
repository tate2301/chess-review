"use client";

import { cn } from "@/lib/utils";

interface PieceIconProps {
  san: string;
  color?: "white" | "black";
  size?: number;
  className?: string;
}

export default function PieceIcon({
  san,
  color = "white",
  size = 16,
  className = "",
}: PieceIconProps) {
  // Get piece type from SAN notation
  const getPieceClass = (san: string, color: "white" | "black"): string => {
    if (!san) return "";

    // Handle castling
    if (san.startsWith("O-O")) {
      return color === "white" ? "♔" : "♚";
    }

    // Remove annotations (+, #, x, =, !, ?)
    const cleanSan = san.replace(/[+#x=!?]/g, "");
    const firstChar = cleanSan[0];

    const pieces = {
      white: {
        K: "cm-b-king", // King
        Q: "cm-b-queen", // Queen
        R: "cm-b-rook", // Rook
        B: "cm-b-bishop", // Bishop
        N: "cm-b-knight", // Knight
        P: "cm-b-pawn", // Pawn (default for moves without piece letter)
      },
      black: {
        K: "cm-w-king", // King
        Q: "cm-w-queen", // Queen
        R: "cm-w-rook", // Rook
        B: "cm-w-bishop", // Bishop
        N: "cm-w-knight", // Knight
        P: "cm-w-pawn", // Pawn (default for moves without piece letter)
      },
    };

    // If first character is a piece letter, use it
    if (/[KQRBN]/.test(firstChar)) {
      return pieces[color][firstChar as keyof typeof pieces.white];
    }

    // Otherwise it's a pawn move
    return pieces[color].P;
  };

  const unicodeSymbol = getPieceClass(san, color);

  return (
    <span
      className={cn(
        `cm inline-flex items-center justify-center ${className} text-foreground text-base`,
        unicodeSymbol,
      )}
      style={{
        fontSize: `${size}px`,
        lineHeight: 1,
      }}
    ></span>
  );
}
