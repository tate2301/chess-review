import { FILES, RANKS } from "./constants";
import { Perspective } from "./types";

export function parseFenPlacement(fen: string): (string | null)[] {
  const placement = fen.split(" ")[0];
  const rows = placement.split("/");
  if (rows.length !== 8) throw new Error("Invalid FEN");

  const out: (string | null)[] = [];
  for (const row of rows) {
    for (const ch of row) {
      if (/\d/.test(ch)) {
        const n = parseInt(ch, 10);
        for (let i = 0; i < n; i++) out.push(null);
      } else {
        // convert to our asset codes: wP/wK..., bP/bK...
        const isWhite = ch === ch.toUpperCase();
        const color = isWhite ? "w" : "b";
        const kind = ch.toUpperCase(); // P N B R Q K
        out.push(`${color}${kind}`);
      }
    }
    if (out.length % 8 !== 0) throw new Error("Invalid FEN row width");
  }
  if (out.length !== 64) throw new Error("Invalid FEN length");
  return out;
}

export function algebraic(
  fileIdx: number,
  rankIdx: number,
  perspective: Perspective,
) {
  const f = perspective === "white" ? fileIdx : 7 - fileIdx;
  const r = perspective === "white" ? rankIdx : 7 - rankIdx;
  return `${FILES[f]}${RANKS[r]}`;
}
