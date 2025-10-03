"use client";

import { Evaluation } from "@/types/Evaluation";
import BoardRenderer from "../board";
import BoardPlayer from "../board-player";
import EvaluationBar from "../EvaluationBar";
import { useMemo } from "react";
import { Chess } from "chess.js";

type Props = {
  pgn: string;
  evaluation: Evaluation;
};

export default function BoardRoom({ pgn, evaluation }: Props) {
  const fenFromPgn = useMemo(() => {
    const g = new Chess();
    g.loadPgn(pgn);
    return g.fen();
  }, [pgn]);

  return (
    <div className="col-span-3 flex gap-3 items-center justify-center min-w-0">
      {/* Evaluation Bar */}

      {/* Chessboard */}
      <div className="flex-shrink-0 h-screen flex-1 flex flex-col p-4 mx-auto max-w-[min(92vw,720px)] space-y-2 justify-center">
        <BoardPlayer
          name="Christopher Chinyamakobvu"
          rating={1878}
          country="ZW"
          title="IM"
          image="/media/player.png"
        />
        <div className="flex">
          <BoardRenderer fen={fenFromPgn} />
          <div className="flex-shrink-0 p-2 flex items-center justify-center h-full py-1">
            <EvaluationBar evaluation={evaluation} />
          </div>
        </div>
        <BoardPlayer
          name="Magnus Carlsen"
          rating={2882}
          country="NO"
          title="GM"
          image="/media/carlsen.png"
        />
      </div>
    </div>
  );
}
