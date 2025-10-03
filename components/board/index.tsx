"use client";

import Image from "next/image";
import { algebraic, parseFenPlacement } from "./utils";
import { Perspective } from "./types";
import { cn } from "@/lib/utils";
import { ASSET_MAP, themeVariables } from "./constants";
import { Button } from "../ui/button";
import { useState } from "react";

export default function BoardRenderer({
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
  perspective = "white",
  showCoords = true,
}: {
  fen?: string;
  perspective?: Perspective;
  showCoords?: boolean;
}) {
  const [color, setColor] = useState<keyof typeof themeVariables>("mono");
  const cells = parseFenPlacement(fen);
  const rows: (string | null)[][] = [];
  for (let r = 0; r < 8; r++) rows.push(cells.slice(r * 8, r * 8 + 8));

  return (
    <div className="w-full mx-auto">
      <div className="max-w-[min(92vw,720px)] mx-auto">
        <div
          className="relative aspect-square rounded overflow-hidden shadow-xl"
          style={
            {
              ...themeVariables[color],
            } as React.CSSProperties
          }
        >
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {rows.map((row, rankIdx) =>
              row.map((piece, fileIdx) => {
                // compute actual square for labels based on perspective
                const sq = algebraic(fileIdx, rankIdx, perspective);
                const isDark = (rankIdx + fileIdx) % 2 === 1;

                return (
                  <div
                    key={sq}
                    aria-label={sq}
                    className={cn(
                      "relative w-full h-full",
                      isDark ? "bg-[var(--sq-dark)]" : "bg-[var(--sq-light)]",
                    )}
                  >
                    {piece && (
                      <Image
                        src={ASSET_MAP[piece]}
                        alt={piece}
                        fill
                        className="p-2 object-contain"
                        sizes="(max-width: 768px) 100vw, 640px"
                        priority
                      />
                    )}

                    {/* tiny coordinates */}
                    {showCoords && fileIdx === 0 && (
                      <span className="absolute left-1 top-1 text-[10px] opacity-60 select-none">
                        {sq.slice(1)}
                      </span>
                    )}
                    {showCoords && rankIdx === 7 && (
                      <span className="absolute right-1 bottom-1 text-[10px] opacity-60 select-none">
                        {sq[0]}
                      </span>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
