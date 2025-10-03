"use client";

import Image from "next/image";
import { algebraic, parseFenPlacement } from "./utils";
import { Perspective } from "./types";
import { cn } from "@/lib/utils";
import { ASSET_MAP, FILES, themeVariables } from "./constants";
import { Button } from "../ui/button";
import { useState } from "react";
import LabelBand from "./LabelBand";

export default function BoardRenderer({
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
  perspective = "white",
  showCoords = true,
}: {
  fen?: string;
  perspective?: Perspective;
  showCoords?: boolean;
}) {
  const RANKS_ASC = [1, 2, 3, 4, 5, 6, 7, 8] as const;
  const RANKS_DESC = [8, 7, 6, 5, 4, 3, 2, 1] as const;

  const [color, setColor] = useState<keyof typeof themeVariables>("mono");
  const cells = parseFenPlacement(fen);
  const rows: (string | null)[][] = [];
  for (let r = 0; r < 8; r++) rows.push(cells.slice(r * 8, r * 8 + 8));

  const BOARD_W = "w-[min(92vw,640px)]";
  const BOARD_H = "h-[min(92vw,640px)]";
  return (
    <div className="grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto_auto] gap-2 items-center">
      {/* Left ranks */}
      <LabelBand
        type="ranks"
        side="left"
        perspective={perspective}
        sizeClass={BOARD_H}
        className="col-start-1 row-start-2"
      />

      <div className="col-start-2 row-start-2">
        <div
          className="relative aspect-square rounded overflow-hidden shadow-xl"
          style={{ ...(themeVariables[color] as React.CSSProperties) }}
        >
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {rows.map((row, rankIdx) =>
              row.map((piece, fileIdx) => {
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

                    {/* optional: turn OFF the inner coords now that we render outside */}
                    {/* remove these two blocks if you don't want inside labels */}
                    {/*
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
                     */}
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>

      {/* Bottom files */}
      <LabelBand
        type="files"
        side="bottom"
        perspective={perspective}
        sizeClass={BOARD_W}
        className="col-start-2 row-start-3"
      />
    </div>
  );
}
