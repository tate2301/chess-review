"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_POSITION } from "chess.js";
import { useChessStore } from "../hooks/useChessStore";
import { analyze_game } from "../lib/engine";
import LoadTab from "./tabs/LoadTab";
import ReportTab from "./tabs/ReportTab";
import SettingsTab from "./tabs/SettingsTab";
import ButtonFooter from "./tabs/ButtonFooter";
import NavigationFooter from "./tabs/NavigationFooter";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "../lib/utils";
import { Upload, BarChart3, Settings, Zap } from "lucide-react";
import { autoCleanPgn } from "../lib/pgnUtils";

// Simple PGN cleaning function
// Use the utility function from pgnUtils instead of local implementation
function cleanPgn(pgn: string): string {
  return autoCleanPgn(pgn);
}

type TabType = "load" | "report" | "settings";

const tabConfig = {
  load: {
    icon: Upload,
    label: "Load",
    description: "Import your chess games",
  },
  report: {
    icon: BarChart3,
    label: "Analysis",
    description: "View game insights",
  },
  settings: {
    icon: Settings,
    label: "Settings",
    description: "Configure analysis",
  },
};

export default function Panel() {
  const [currentTab, setCurrentTab] = useState<TabType>("load");
  const [strPgn, setStrPgn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMove, setCurrentMove] = useState<string>("");

  const { state, setHistory, setMove, setPosition, setEvaluations } =
    useChessStore();
  const { chess, history, engine, settings } = state;

  const setProgressHandler = (n: number, move?: string) => {
    setProgress(n);
    if (move) {
      setCurrentMove(move);
    }
  };

  const onChangeStrPgn = (newPgn: string) => {
    setStrPgn(newPgn);
  };

  const analyze = async () => {
    if (!engine) {
      alert("Engine not loaded yet. Please wait and try again.");
      return;
    }

    if (!strPgn.trim()) {
      alert("Please provide a PGN to analyze.");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setCurrentMove("");

    // Clean and process PGN using comprehensive cleaning function
    let processedPgn = cleanPgn(strPgn);

    try {
      // Create a fresh chess instance for loading
      const { Chess } = await import("chess.js");
      const tempChess = new Chess();

      console.log("=== PGN PROCESSING DEBUG ===");
      console.log("Original PGN length:", strPgn.length);
      console.log("Original PGN:", strPgn);
      console.log("Processed PGN length:", processedPgn.length);
      console.log("Processed PGN:", processedPgn);
      console.log("=== END DEBUG ===");

      // Try to load the PGN - first attempt with detailed debugging
      console.log("=== Attempting to load PGN ===");
      console.log(
        "Using chess.js version and methods available:",
        Object.getOwnPropertyNames(tempChess),
      );

      let success = false;
      try {
        tempChess.loadPgn(processedPgn);
        success = true;
        console.log("loadPgn returned:", success);
        if (success) {
          console.log("PGN loaded successfully!");
          console.log("Game history after load:", tempChess.history());
          console.log("Current FEN:", tempChess.fen());
        } else {
          console.log("loadPgn returned false - invalid PGN format");
          console.log("Chess.js error - current FEN:", tempChess.fen());
        }
      } catch (error: any) {
        console.log("loadPgn threw an exception:", error);
        console.log("Exception message:", error.message);
        console.log("Exception stack:", error.stack);
        success = false;
      }

      if (!success) {
        console.log("First PGN load failed, trying alternative cleaning...");

        // Try a more aggressive cleaning approach for Chess.com PGNs
        let alternativePgn = strPgn.trim();

        // Remove ALL comments and annotations
        alternativePgn = alternativePgn.replace(/\{[^}]*\}/g, "");

        // Remove move timestamps and other bracketed content within moves
        alternativePgn = alternativePgn.replace(/\[[^\]]*\](?!\s*$)/g, "");

        // Keep only headers and basic moves
        const lines = alternativePgn.split("\n");
        const cleanLines = [];
        let inHeaders = true;

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.match(/^\[.*\]$/)) {
            if (inHeaders) cleanLines.push(trimmed);
          } else if (
            trimmed.match(/^\d+\./) ||
            trimmed.includes("1-0") ||
            trimmed.includes("0-1") ||
            trimmed.includes("1/2-1/2")
          ) {
            inHeaders = false;
            cleanLines.push(trimmed);
          } else if (!inHeaders && trimmed) {
            cleanLines.push(trimmed);
          }
        }

        alternativePgn = cleanLines
          .join("\n")
          .replace(/\s+/g, " ")
          .replace(/(\d+\.)/g, "\n$1")
          .trim();

        // Ensure proper header/moves separation
        alternativePgn = alternativePgn.replace(/]\s*1\./, "]\n\n1.");

        console.log("Alternative cleaned PGN:", alternativePgn);

        tempChess.loadPgn(alternativePgn);
        success = true;
        if (success) {
          console.log("Alternative cleaning successful!");
          processedPgn = alternativePgn;
        } else {
          console.log("Alternative cleaning failed, trying final fallback...");

          // Final fallback: extract only the absolute basics
          let finalPgn = strPgn;

          // Remove everything in curly braces
          finalPgn = finalPgn.replace(/\{[^}]*\}/g, " ");

          // Extract just the move sequence using a more aggressive approach
          const movePattern =
            /(\d+\.+\s*[a-zA-Z][a-zA-Z0-9+#=\-\+]*(?:\s+[a-zA-Z][a-zA-Z0-9+#=\-\+]*)?)/g;
          const moves = finalPgn.match(movePattern) || [];

          // Get result
          const resultPattern = /(1-0|0-1|1\/2-1\/2)/;
          const result = finalPgn.match(resultPattern)?.[0] || "";

          // Reconstruct minimal PGN
          const headers = [
            '[Event "Chess.com Game"]',
            '[Site "Chess.com"]',
            '[Date "2024.01.01"]',
            '[Round "1"]',
            '[White "Player1"]',
            '[Black "Player2"]',
            `[Result "${result || "*"}"]`,
          ];

          finalPgn =
            headers.join("\n") + "\n\n" + moves.join(" ") + " " + result;

          console.log("Final fallback PGN:", finalPgn);

          tempChess.loadPgn(finalPgn);
          success = true;
          if (success) {
            console.log("Final fallback successful!");
            processedPgn = finalPgn;
          }
        }
      }

      if (!success) {
        // Try to identify specific issues
        if (processedPgn.includes("{[%") || strPgn.includes("{[%")) {
          throw new Error(
            "PGN contains Chess.com annotations that couldn't be cleaned. Please try a different game or clean the PGN manually.",
          );
        } else if (!processedPgn.includes("1.")) {
          throw new Error(
            "No moves found in PGN. Make sure the PGN contains actual game moves.",
          );
        } else {
          throw new Error(
            "Invalid PGN format. The moves may contain errors or unsupported notation. Please check your PGN and try again.",
          );
        }
      }

      const gameHistory = tempChess.history({ verbose: true });
      console.log("Game history loaded:", gameHistory.length, "moves");

      if (gameHistory.length === 0) {
        throw new Error(
          "No valid moves found in PGN. The game may be incomplete or contain notation errors.",
        );
      }

      console.log("First few moves:", gameHistory.slice(0, 5));

      // Update the main chess instance
      chess.loadPgn(processedPgn);

      // Set game state
      setHistory(gameHistory);
      setMove(-1);

      // Reset to starting position
      const startingPosition = gameHistory[0].before || DEFAULT_POSITION;
      console.log("Setting starting position:", startingPosition);
      setPosition(startingPosition);

      // Clear previous evaluations
      setEvaluations([]);

      // Switch to report tab immediately to show moves
      setCurrentTab("report");

      // Analyze the game
      const report = await analyze_game(
        engine,
        gameHistory,
        chess,
        settings.depth,
        setProgressHandler,
      );
      console.log("Analysis complete:", report);
      setEvaluations(report);
    } catch (e: any) {
      console.error("Analysis error:", e);
      console.error("Original PGN:", strPgn);
      console.error("Processed PGN:", processedPgn);

      let errorMessage =
        e.message || "An unknown error occurred during analysis.";

      // Provide more helpful error messages for common issues
      if (e.message?.includes("Invalid move")) {
        const moveMatch = e.message.match(/Invalid move in PGN: (\S+)/);
        if (moveMatch) {
          errorMessage = `Invalid chess move detected: "${moveMatch[1]}". This could be due to Chess.com formatting issues or a corrupted PGN. Try selecting a different game.`;
        }
      } else if (e.message?.includes("annotations")) {
        errorMessage =
          "Chess.com annotations couldn't be processed. Try a different game or manually clean the PGN.";
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
      setProgress(0);
      setCurrentMove("");
    }
  };

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <>
      <Tabs
        className="sticky top-0 z-10  mb-4"
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as TabType)}
      >
        <TabsList className="grid w-full grid-cols-3 tabs-mercury">
          {Object.entries(tabConfig).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = currentTab === key;

            return (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  "tab-mercury relative overflow-hidden",
                  isActive && "tab-mercury-active",
                )}
              >
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                </motion.div>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--mercury-accent))]/10 to-[hsl(var(--mercury-accent-2))]/10 rounded-sm"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <div className="flex flex-col mercury-module overflow-y-auto flex-1">
        <div className="flex-1 flex flex-col p-2 pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1"
            >
              {currentTab === "load" && (
                <LoadTab
                  onChange={onChangeStrPgn}
                  analyze={analyze}
                  isLoading={isLoading}
                />
              )}
              {currentTab === "report" && <ReportTab />}
              {currentTab === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 mercury-glass rounded-lg flex items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-12 h-12 mx-auto rounded-full border-4 border-[hsl(var(--mercury-accent))]/20 border-t-[hsl(var(--mercury-accent))]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Analyzing Game</p>
                  <p className="text-sm mercury-text-muted">
                    {currentMove
                      ? `Analyzing: ${currentMove}`
                      : "Processing moves..."}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[hsl(var(--mercury-accent))] to-[hsl(var(--mercury-accent-2))] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flow State Indicator */}
        {currentTab === "report" && history.length > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-[hsl(var(--mercury-accent))] to-[hsl(var(--mercury-accent-2))] shadow-lg"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
              <Zap className="h-2 w-2 text-[hsl(var(--mercury-accent))]" />
            </div>
          </motion.div>
        )}
      </div>
      {(currentTab === "load" || currentTab === "settings") && (
        <ButtonFooter
          onClick={analyze}
          isLoading={isLoading}
          progress={progress}
        />
      )}
      {currentTab === "report" && (
        <motion.div
          className="p-4 sticky bottom-0 bg-mercury-surface-elevated text-foreground border border-input z-10 rounded-2xl shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NavigationFooter />
        </motion.div>
      )}
    </>
  );
}
