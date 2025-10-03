"use client";

import clsx from "clsx";

type Perspective = "white" | "black";
type BandType = "files" | "ranks";
type BandSide = "top" | "bottom" | "left" | "right";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS_ASC = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const RANKS_DESC = [8, 7, 6, 5, 4, 3, 2, 1] as const;

function orderedFiles(p: Perspective) {
  return p === "white" ? FILES : ([...FILES].reverse() as typeof FILES);
}
function orderedRanks(p: Perspective) {
  return p === "white" ? RANKS_DESC : RANKS_ASC;
}

export default function LabelBand({
  type, // "files" | "ranks"
  side, // "top" | "bottom" | "left" | "right"
  perspective = "white",
  sizeClass, // width for files band, height for ranks band (e.g., "w-[min(92vw,640px)]")
  className, // extra classes for the wrapper
  labelClass = "text-xs text-muted-foreground",
}: {
  type: BandType;
  side: BandSide;
  perspective?: Perspective;
  /** For files: width class (w-…); for ranks: height class (h-…) */
  sizeClass: string;
  className?: string;
  /** Applied to each label cell */
  labelClass?: string;
}) {
  const isFiles = type === "files";
  const items = isFiles ? orderedFiles(perspective) : orderedRanks(perspective);

  // Grid template depends on band type
  const gridTemplate = isFiles ? "grid grid-cols-8" : "grid grid-rows-8";

  // Align labels nicely depending on side
  const labelAlign =
    side === "top" || side === "bottom"
      ? "text-center"
      : side === "left"
        ? "self-center pr-1"
        : "self-center pl-1";

  return (
    <div className={clsx(className)}>
      <div className={clsx(gridTemplate, sizeClass)}>
        {items.map((v) => (
          <span
            key={`${type}-${side}-${v}`}
            className={clsx(labelClass, "select-none", labelAlign)}
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
