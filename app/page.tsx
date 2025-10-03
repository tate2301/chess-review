"use client";

import { useEffect } from "react";
import { useChessStore } from "../hooks/useChessStore";
import { init } from "../lib/engine";
import { preloadAudio } from "../lib/media";
import Chessboard from "../components/Chessboard";
import EvaluationBar from "../components/EvaluationBar";
import Panel from "../components/Panel";
import { motion } from "framer-motion";
import BoardRenderer from "@/components/board";
import Image from "next/image";
import BoardPlayer from "@/components/board-player";
import BoardRoom from "@/components/board-room";
import MoveTable from "@/components/move-table";

const TEST_PGN = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2025.08.01"]
[Round "-"]
[White "kamfeskaya12"]
[Black "slavikrtn"]
[Result "1-0"]
[CurrentPosition "r3k1nr/1p4Qp/4p3/PpppP3/1b6/8/1PPB1PPP/R3K2R b KQkq - 0 16"]
[Timezone "UTC"]
[ECO "B00"]
[ECOUrl "https://www.chess.com/openings/Nimzowitsch-Defense-2.d4-e6-3.Nf3-d5-4.e5"]
[UTCDate "2025.08.01"]
[UTCTime "10:06:08"]
[WhiteElo "871"]
[BlackElo "863"]
[TimeControl "600"]
[Termination "kamfeskaya12 won by resignation"]
[StartTime "10:06:08"]
[EndDate "2025.08.01"]
[EndTime "10:11:21"]
[Link "https://www.chess.com/game/live/141354708810"]

1. e4 {[%clk 0:09:52.8]} 1... d5 {[%clk 0:09:58.5]} 2. e5 {[%clk 0:09:48.2]} 2... e6 {[%clk 0:09:57.8]} 3. d4 {[%clk 0:09:45.2]} 3... Nc6 {[%clk 0:09:57]} 4. Nf3 {[%clk 0:09:41.6]} 4... Be7 {[%clk 0:09:56.2]} 5. a4 {[%clk 0:09:35.4]} 5... f6 {[%clk 0:09:55.5]} 6. Bb5 {[%clk 0:09:15.6]} 6... Bd7 {[%clk 0:09:50.3]} 7. Bd2 {[%clk 0:08:58.4]} 7... fxe5 {[%clk 0:09:37.4]} 8. dxe5 {[%clk 0:08:50.8]} 8... a6 {[%clk 0:09:26]} 9. Bxc6 {[%clk 0:08:45.2]} 9... Bxc6 {[%clk 0:09:23.3]} 10. Nd4 {[%clk 0:08:42]} 10... Qd7 {[%clk 0:09:03.7]} 11. a5 {[%clk 0:08:25.7]} 11... Bb5 {[%clk 0:08:07.7]} 12. Nc3 {[%clk 0:08:10.2]} 12... Bb4 {[%clk 0:07:56.3]} 13. Qg4 {[%clk 0:07:56.4]} 13... c5 {[%clk 0:07:30.5]} 14. Ndxb5 {[%clk 0:07:48.2]} 14... Qxb5 {[%clk 0:07:26.3]} 15. Nxb5 {[%clk 0:07:42.9]} 15... axb5 {[%clk 0:07:22.1]} 16. Qxg7 {[%clk 0:07:38.4]} 1-0`;

export default function Home() {
  const { state, setEngine } = useChessStore();
  const { settings, evaluation } = state;

  useEffect(() => {
    // Initialize engine when settings change
    init(settings.engine).then((worker) => {
      setEngine(worker);
    });
  }, [settings.engine, setEngine]);

  useEffect(() => {
    // Preload audio files
    preloadAudio("sfx-move", "/media/move.webm");
    preloadAudio("sfx-capture", "/media/capture.webm");
    preloadAudio("sfx-check", "/media/check.webm");
    preloadAudio("sfx-promotion", "/media/promotion.webm");
    preloadAudio("sfx-checkmate", "/media/checkmate.webm");
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <div className="h-full grid grid-cols-4  gap-4">
        {/* Chess Board Section */}
        <BoardRoom pgn={TEST_PGN} evaluation={evaluation} />

        {/* Control Panel */}
        <div className="flex-shrink-0 col-span-1 overflow-y-auto p-2">
          <MoveTable pgn={TEST_PGN} />
        </div>
      </div>
    </div>
  );
}
