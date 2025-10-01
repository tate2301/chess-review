"use client";

import PieceIcon from "./PieceIcon";

export default function PieceIconTest() {
  const testMoves = [
    { san: "e4", color: "white" as const },
    { san: "e5", color: "black" as const },
    { san: "Nf3", color: "white" as const },
    { san: "Nc6", color: "black" as const },
    { san: "Bb5", color: "white" as const },
    { san: "a6", color: "black" as const },
    { san: "Ba4", color: "white" as const },
    { san: "Nf6", color: "black" as const },
    { san: "O-O", color: "white" as const },
    { san: "Be7", color: "black" as const },
    { san: "Re1", color: "white" as const },
    { san: "b5", color: "black" as const },
    { san: "Bb3", color: "white" as const },
    { san: "d6", color: "black" as const },
    { san: "c3", color: "white" as const },
    { san: "O-O", color: "black" as const },
    { san: "h3", color: "white" as const },
    { san: "Nb8", color: "black" as const },
    { san: "d4", color: "white" as const },
    { san: "Nbd7", color: "black" as const },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Chess Piece Icons Test</h2>

      <div className="grid grid-cols-2 gap-4">
        {testMoves.map((move, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="font-mono text-sm text-gray-500">
              {Math.floor(index / 2) + 1}.{index % 2 === 0 ? "" : ".."}
            </div>
            <PieceIcon san={move.san} color={move.color} size={20} />
            <div className="font-medium">{move.san}</div>
            <div className="text-xs text-gray-500 capitalize">{move.color}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">All Piece Types</h3>
        <div className="grid grid-cols-6 gap-4">
          {["K", "Q", "R", "B", "N", "P"].map((piece) => (
            <div key={piece} className="text-center space-y-2">
              <div className="font-semibold">{piece}</div>
              <div className="flex justify-center gap-2">
                <PieceIcon san={piece === "P" ? "e4" : piece + "f3"} color="white" size={24} />
                <PieceIcon san={piece === "P" ? "e5" : piece + "f6"} color="black" size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Special Moves</h3>
        <div className="flex gap-6">
          <div className="text-center space-y-2">
            <div className="font-semibold">Castling Kingside</div>
            <div className="flex justify-center gap-2">
              <PieceIcon san="O-O" color="white" size={24} />
              <PieceIcon san="O-O" color="black" size={24} />
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="font-semibold">Castling Queenside</div>
            <div className="flex justify-center gap-2">
              <PieceIcon san="O-O-O" color="white" size={24} />
              <PieceIcon san="O-O-O" color="black" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
