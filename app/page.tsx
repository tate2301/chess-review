"use client";

import { useEffect } from "react";
import { useChessStore } from "../hooks/useChessStore";
import { init } from "../lib/engine";
import { preloadAudio } from "../lib/media";
import Chessboard from "../components/Chessboard";
import EvaluationBar from "../components/EvaluationBar";
import Panel from "../components/Panel";
import { motion } from "framer-motion";

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
    <div className="h-screen overflow-hidden bg-background">
      <div className="h-full grid grid-cols-4  gap-4">
        {/* Chess Board Section */}
        <div className="col-span-3 flex gap-3 items-center justify-center min-w-0">
          {/* Evaluation Bar */}
          <div className="flex-shrink-0 p-2 flex items-center justify-center h-full py-12">
            <EvaluationBar evaluation={evaluation} />
          </div>

          {/* Chessboard */}
          <div className="flex-shrink-0 h-screen flex-1 p-4 flex justify-center">
            <Chessboard />
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex-shrink-0 col-span-1 overflow-y-auto p-2">
          <Panel />
        </div>
      </div>
    </div>
  );
}
