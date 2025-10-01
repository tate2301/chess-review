"use client";

import { DEFAULT_POSITION } from "chess.js";
import { useChessStore } from "../../hooks/useChessStore";
import { toTableSource } from "../../lib/table";
import { formatScore } from "../../lib/evaluation";
import { getLabelHexColor } from "../../lib/label";
import { getPieceColorFromMoveIndex } from "../../lib/piece";
import FeedbackComponent from "./FeedbackComponent";
import PieceIcon from "../PieceIcon";
import Label from "../../types/Label";
import { cn } from "@/lib/utils";

export default function ReportTab() {
  const { state, setMove, setPosition, navigateToMove } = useChessStore();
  const { history, move, evaluation, evaluations } = state;

  const tableData = toTableSource(history);
  const san = history[move]?.san || "";
  const score = formatScore(evaluation);

  // Calculate accuracy for both players
  const calculateAccuracy = (color: "w" | "b") => {
    if (evaluations.length === 0) return 0;

    const playerMoves = evaluations.filter(
      (_, index) => history[index] && history[index].color === color,
    );

    if (playerMoves.length === 0) return 0;

    const totalWinChanceLost = playerMoves.reduce(
      (sum, evaluation, evalIndex) => {
        const moveIndex = evaluations.indexOf(evaluation);
        const prevEval = moveIndex > 0 ? evaluations[moveIndex - 1] : null;
        if (!prevEval) return sum;

        // Calculate win chance lost based on evaluation changes
        const winChanceLost = Math.abs(evaluation.score - prevEval.score) / 100;
        return sum + Math.min(winChanceLost, 20); // Cap at 20% loss per move
      },
      0,
    );

    const avgWinChanceLost = totalWinChanceLost / playerMoves.length;
    return Math.max(0, Math.min(100, 100 - avgWinChanceLost * 5));
  };

  const whiteAccuracy = Math.round(calculateAccuracy("w"));
  const blackAccuracy = Math.round(calculateAccuracy("b"));

  // Count move types for summary
  const moveStats = evaluations.reduce(
    (stats, evaluation) => {
      switch (evaluation.label) {
        case Label.BRILLIANT:
        case Label.GREAT:
          stats.excellent++;
          break;
        case Label.BEST:
        case Label.EXCELLENT:
        case Label.GOOD:
          stats.good++;
          break;
        case Label.INACCURACY:
          stats.inaccuracies++;
          break;
        case Label.MISTAKE:
          stats.mistakes++;
          break;
        case Label.BLUNDER:
          stats.blunders++;
          break;
      }
      return stats;
    },
    { excellent: 0, good: 0, inaccuracies: 0, mistakes: 0, blunders: 0 },
  );

  const onRowSelected = (rowIndex: number, cellIndex: number) => {
    // Handle starting position row (rowIndex === 0)
    if (rowIndex === 0 && cellIndex === 1) {
      navigateToMove(-1);
      return;
    }

    // Calculate the actual move index based on row and cell
    // Adjust rowIndex for the starting position row
    const adjustedRowIndex = rowIndex - 1;

    // cellIndex 0 = move number (shouldn't be clickable for moves)
    // cellIndex 1 = white move (adjustedRowIndex * 2)
    // cellIndex 2 = black move (adjustedRowIndex * 2 + 1)
    let moveIndex: number;
    if (cellIndex === 1) {
      moveIndex = adjustedRowIndex * 2;
    } else if (cellIndex === 2) {
      moveIndex = adjustedRowIndex * 2 + 1;
    } else {
      return; // Don't navigate on move number click
    }

    if (moveIndex >= 0 && moveIndex < history.length) {
      navigateToMove(moveIndex);
    }
  };

  return (
    <div className="space-y-4">
      {/* Move Analysis */}
      <FeedbackComponent
        san={san}
        score={score}
        label={evaluation.label}
        opening={evaluation.opening}
        best={evaluation.best}
      />
      {/* No moves loaded message */}
      {history.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-6 text-center">
          <div className="text-blue-800 dark:text-blue-200">
            <div className="text-4xl mb-3">♟️</div>
            <p className="font-semibold text-lg">No game loaded</p>
            <p className="text-sm mt-2 opacity-80">
              Go to the Load tab to import a PGN file or load a game from
              Chess.com
            </p>
            <p className="text-xs mt-2 opacity-60">
              You can also try the "Load Test Game" button for a quick demo
            </p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            {history.length > 0 && (
              <>
                {/* Starting position row */}
                <tr className="">
                  <td className="px-3 py-2 text-center font-medium text-gray-500">
                    -
                  </td>
                  <td
                    className={`px-3 py-2 cursor-pointer transition-colors ${
                      move === -1
                        ? "bg-blue-100 dark:bg-blue-900 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => onRowSelected(0, 1)}
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      Starting Position
                    </span>
                  </td>
                  <td className="px-3 py-2 w-1/3"></td>
                </tr>

                {/* Move rows */}
                {tableData.body.map((row, rowIndex) => (
                  <tr className="py-2" key={rowIndex + 1}>
                    <td className="px-3 py-2 text-center font-medium text-muted-foreground">
                      {row[0]}
                    </td>
                    <td
                      className={`px-3 py-2 cursor-pointer transition-colors ${
                        move === rowIndex * 2
                          ? "bg-secondary font-medium text-secondary-foreground"
                          : "hover:bg-border border-input"
                      }`}
                      onClick={() => onRowSelected(rowIndex + 1, 1)}
                    >
                      <div className="flex items-center gap-2">
                        <PieceIcon
                          san={row[1]}
                          color={getPieceColorFromMoveIndex(rowIndex * 2)}
                          size={16}
                          className="flex-shrink-0"
                        />
                        <span className="text-foreground font-mono">
                          {row[1]}
                        </span>
                      </div>
                    </td>
                    {row[2] ? (
                      <td
                        className={`px-3 py-2 cursor-pointer transition-colors ${
                          move === rowIndex * 2 + 1
                            ? "bg-secondary font-medium text-secondary-foreground"
                            : "hover:bg-border border-input"
                        }`}
                        onClick={() => onRowSelected(rowIndex + 1, 2)}
                      >
                        <div className="flex items-center gap-2">
                          <PieceIcon
                            san={row[2]}
                            color={getPieceColorFromMoveIndex(rowIndex * 2 + 1)}
                            size={16}
                            className={cn(
                              "flex-shrink-0",
                              getPieceColorFromMoveIndex(rowIndex * 2 + 1) ===
                                "white"
                                ? "text-secondary"
                                : "text-background",
                            )}
                          />
                          <span className="text-foreground font-mono">
                            {row[2]}
                          </span>
                        </div>
                      </td>
                    ) : (
                      <td className="px-3 py-2 w-1/3"></td>
                    )}
                  </tr>
                ))}
              </>
            )}
            {history.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  <div className="text-2xl mb-2">🏁</div>
                  <div>Load a game to see moves here</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
