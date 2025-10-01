"use client";

import { getLabelClassColor, shouldShowBest } from "../../lib/label";
import Label from "../../types/Label";
import LabelIcon from "../LabelIcon";
import PieceIcon from "../PieceIcon";

interface FeedbackComponentProps {
  san: string;
  label: Label;
  score: string;
  opening?: string;
  best?: string;
}

const getMoveDescription = (label: Label): string => {
  switch (label) {
    case Label.BRILLIANT:
      return "An outstanding move! The very best choice in a complex position.";
    case Label.GREAT:
      return "A strong move that takes advantage of your opponent's mistake.";
    case Label.BEST:
      return "The computer's top choice. Well played!";
    case Label.EXCELLENT:
      return "A very good move. You're on the right track!";
    case Label.GOOD:
      return "A solid choice. This keeps you in a good position.";
    case Label.BOOK:
      return "A well-known theoretical move from opening theory.";
    case Label.FORCED:
      return "The only reasonable move in this position.";
    case Label.INACCURACY:
      return "This isn't the best, but it's not a serious mistake.";
    case Label.MISTAKE:
      return "This move loses some advantage. Look for better alternatives.";
    case Label.BLUNDER:
      return "A serious mistake that significantly worsens your position.";
    case Label.MISSED:
      return "You missed a great opportunity your opponent gave you.";
    case Label.CHECKMATE:
      return "Checkmate! Game over.";
    default:
      return "Move analysis unavailable.";
  }
};

const getLabelColor = (label: Label): string => {
  switch (label) {
    case Label.BRILLIANT:
      return "from-teal-400 to-cyan-400";
    case Label.GREAT:
      return "from-sky-400 to-blue-400";
    case Label.BEST:
      return "from-emerald-400 to-green-400";
    case Label.EXCELLENT:
      return "from-lime-400 to-green-400";
    case Label.GOOD:
      return "from-green-500 to-emerald-500";
    case Label.BOOK:
      return "from-gray-400 to-stone-400";
    case Label.FORCED:
      return "from-gray-500 to-neutral-500";
    case Label.INACCURACY:
      return "from-yellow-400 to-amber-400";
    case Label.MISTAKE:
      return "from-orange-400 to-red-400";
    case Label.BLUNDER:
      return "from-red-500 to-red-600";
    case Label.MISSED:
      return "from-pink-500 to-red-500";
    default:
      return "from-gray-400 to-gray-500";
  }
};

export default function FeedbackComponent({
  san,
  label,
  score,
  opening,
  best,
}: FeedbackComponentProps) {
  // Handle when no move is selected (starting position)
  if (label === Label.UNDEFINED || !san) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Move Header */}
      <div
        className={`bg-gradient-to-r ${getLabelColor(label)} rounded-lg p-4 text-white shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LabelIcon label={label} className="w-8 h-8 text-white" />
            <div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <PieceIcon san={san} color="white" size={24} />
                {san}
              </div>
              <div className="text-sm opacity-90">{label}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{score}</div>
            <div className="text-xs opacity-75">evaluation</div>
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 h-60">
        <div className="text-gray-700 dark:text-gray-300">
          {getMoveDescription(label)}
        </div>

        {opening && (
          <div className="pt-3 mt-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Opening:
            </div>
            <div className="font-medium text-gray-800 dark:text-white">
              {opening}
            </div>
          </div>
        )}

        {best && shouldShowBest(label) && (
          <div className="pt-3 mt-3">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-md p-3">
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
                Computer's best move:
              </div>
              <div className="text-blue-800 dark:text-blue-200 font-bold">
                {best}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
