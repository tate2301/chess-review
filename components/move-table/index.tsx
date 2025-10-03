"use client";

import { useMemo } from "react";
import { Chess, Move } from "chess.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Ply from "./ply";

export type Row = {
  num: number;
  white?: {
    san: string;
    piece: Move["piece"];
    color: Move["color"];
    promotion?: Move["promotion"];
  };
  black?: {
    san: string;
    piece: Move["piece"];
    color: Move["color"];
    promotion?: Move["promotion"];
  };
};

export default function MoveTable({ pgn }: { pgn: string }) {
  const rows = useMemo<Row[]>(() => {
    const game = new Chess();
    game.loadPgn(pgn);

    const verbose = game.history({ verbose: true }) as Move[];
    const out: Row[] = [];
    let moveNum = 1;

    for (let i = 0; i < verbose.length; i += 2) {
      const w = verbose[i];
      const b = verbose[i + 1];
      out.push({
        num: moveNum++,
        white: w
          ? {
              san: w.san,
              piece: w.piece,
              color: w.color,
              promotion: w.promotion,
            }
          : undefined,
        black: b
          ? {
              san: b.san,
              piece: b.piece,
              color: b.color,
              promotion: b.promotion,
            }
          : undefined,
      });
    }
    return out;
  }, [pgn]);

  return (
    <div className="w-full">
      <Table className="w-full text-sm">
        <TableBody>
          {rows.map((r) => (
            <TableRow
              key={r.num}
              className="border-b border-border last:border-none"
            >
              <TableCell className="px-3 py-2 text-muted-foreground">
                {r.num}
              </TableCell>
              <TableCell className="px-3 py-2">
                <Ply data={r.white} />
              </TableCell>
              <TableCell className="px-3 py-2">
                <Ply data={r.black} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
