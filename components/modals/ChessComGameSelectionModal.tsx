"use client";

import { isDraw, userWon } from "../../lib/api";
import { getRelativeTimeFromNowString } from "../../lib/date";

interface ChessComGameSelectionModalProps {
  games: any[];
  username: string;
  onGameSelected: (game: any, orientation: "w" | "b") => void;
  onClose: () => void;
}

export default function ChessComGameSelectionModal({
  games,
  username,
  onGameSelected,
  onClose,
}: ChessComGameSelectionModalProps) {
  const handleGameClick = (game: any) => {
    if (!game.pgn) {
      alert("This game has no PGN data available. Please select another game.");
      return;
    }
    const orientation = game.white.username === username ? "w" : "b";
    onGameSelected(game, orientation);
  };

  const handleKeyDown = (e: React.KeyboardEvent, game: any) => {
    if (e.key === "Enter") {
      handleGameClick(game);
    }
  };

  const getGameResultClass = (game: any) => {
    if (isDraw(game)) {
      return "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/50";
    } else if (userWon(username, game)) {
      return "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/50";
    } else {
      return "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/50";
    }
  };

  const getGameResultIcon = (game: any) => {
    if (isDraw(game)) {
      return "🤝";
    } else if (userWon(username, game)) {
      return "🎉";
    } else {
      return "😔";
    }
  };

  const formatTimeControl = (timeControl: string) => {
    if (!timeControl) return "Unknown";
    const [base, increment] = timeControl.split("+");
    if (increment) {
      return `${Math.floor(parseInt(base) / 60)}+${increment}`;
    }
    return `${Math.floor(parseInt(base) / 60)} min`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Games
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {username} • {games.length} games found
            </p>
          </div>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            onClick={onClose}
            title="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-3">
          {games.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🏁</div>
              <p className="text-gray-600 dark:text-gray-400">No games found</p>
            </div>
          ) : (
            games.map((game, index) => (
              <div
                key={`${game.end_time}-${index}`}
                onClick={() => handleGameClick(game)}
                onKeyDown={(e) => handleKeyDown(e, game)}
                role="button"
                className={`border rounded-lg p-4 cursor-pointer transition-all ${getGameResultClass(game)} ${
                  !game.pgn ? "opacity-50 cursor-not-allowed" : ""
                }`}
                tabIndex={index}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getGameResultIcon(game)}</span>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTimeControl(game.time_control)} •{" "}
                      {game.rules || "Standard"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {getRelativeTimeFromNowString(
                      new Date(game.end_time * 1000),
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium ${
                        game.white.username === username
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      ⚪ {game.white.username}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({game.white.rating})
                    </span>
                  </div>

                  <span className="text-gray-400 mx-2">vs</span>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium ${
                        game.black.username === username
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {game.black.username} ⚫
                    </span>
                    <span className="text-sm text-gray-500">
                      ({game.black.rating})
                    </span>
                  </div>
                </div>

                {!game.pgn && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                    ⚠️ No PGN data available
                  </div>
                )}
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
