"use client";

import { useEffect, useRef } from "react";
import { useChessStore } from "../hooks/useChessStore";
import { DEFAULT_POSITION } from "chess.js";
import { playMoveTypeSound } from "../lib/media";
import { getMoveType } from "../lib/chess";
import "./chessboard.css";

// @ts-expect-error: no declaration file as it was written in JS
import { Chessboard as CMChessboard } from "cm-chessboard/src/Chessboard";

export default function Chessboard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardInstance = useRef<any>(null);
  const { state } = useChessStore();
  const { position, history, move, evaluation, settings } = state;

  useEffect(() => {
    if (boardRef.current && !boardInstance.current) {
      boardInstance.current = new CMChessboard(boardRef.current, {
        position: DEFAULT_POSITION,
        assetsUrl: "/",
        animationDuration: 50,
        style: {
          pieces: {
            file: "standard.svg",
          },
        },
        extensions: [
          // Note: You'll need to implement EvaluationMarkerExtension
          // {
          //   class: EvaluationMarkerExtension
          // }
        ],
      });
    }

    return () => {
      if (boardInstance.current) {
        boardInstance.current.destroy();
        boardInstance.current = null;
      }
    };
  }, []);

  // Update board orientation when settings change
  useEffect(() => {
    if (boardInstance.current) {
      boardInstance.current.setOrientation(settings.orientation);
      // Clear markers when orientation changes
      try {
        if (typeof boardInstance.current.removeMarkers === "function") {
          boardInstance.current.removeMarkers();
        } else if (typeof boardInstance.current.clearMarkers === "function") {
          boardInstance.current.clearMarkers();
        } else if (typeof boardInstance.current.setMarkers === "function") {
          boardInstance.current.setMarkers([]);
        }
      } catch (error) {
        console.warn("Failed to clear markers on orientation change:", error);
      }
    }
  }, [settings.orientation]);

  // Update board position
  useEffect(() => {
    if (boardInstance.current) {
      boardInstance.current.setPosition(position, true);
    }
  }, [position]);

  // Update markers and play sounds
  useEffect(() => {
    if (boardInstance.current && history.length > 0 && move >= 0) {
      const currentMove = history[move];
      playMoveTypeSound(getMoveType(currentMove.san));

      // Clear existing markers first
      try {
        if (typeof boardInstance.current.removeMarkers === "function") {
          boardInstance.current.removeMarkers();
        } else if (typeof boardInstance.current.clearMarkers === "function") {
          boardInstance.current.clearMarkers();
        }

        // Try different marker methods
        if (typeof boardInstance.current.addMarker === "function") {
          boardInstance.current.addMarker(currentMove.from, "dot");
          boardInstance.current.addMarker(currentMove.to, "circle");
        } else if (typeof boardInstance.current.setMarkers === "function") {
          boardInstance.current.setMarkers([
            { square: currentMove.from, type: "dot" },
            { square: currentMove.to, type: "circle" },
          ]);
        } else {
          // Fallback: highlight squares using CSS classes with evaluation-based colors
          const fromSquare = document.querySelector(
            `[data-square="${currentMove.from}"]`,
          );
          const toSquare = document.querySelector(
            `[data-square="${currentMove.to}"]`,
          );

          // Clear existing highlights
          document
            .querySelectorAll(
              ".highlight-from, .highlight-to, [class*='highlight-']",
            )
            .forEach((el) => {
              el.className = el.className.replace(/highlight-\w+/g, "").trim();
            });

          const labelClass = `highlight-${evaluation.label.toLowerCase()}`;

          if (fromSquare) {
            fromSquare.classList.add("highlight-from", labelClass);
          }
          if (toSquare) {
            toSquare.classList.add("highlight-to", labelClass);
          }
        }
      } catch (error) {
        console.warn("Failed to set markers:", error);
      }
    } else if (boardInstance.current) {
      try {
        if (typeof boardInstance.current.removeMarkers === "function") {
          boardInstance.current.removeMarkers();
        } else if (typeof boardInstance.current.clearMarkers === "function") {
          boardInstance.current.clearMarkers();
        } else if (typeof boardInstance.current.setMarkers === "function") {
          boardInstance.current.setMarkers([]);
        } else {
          // Remove CSS highlights
          document
            .querySelectorAll(
              ".highlight-from, .highlight-to, [class*='highlight-']",
            )
            .forEach((el) => {
              el.className = el.className.replace(/highlight-\w+/g, "").trim();
            });
        }
      } catch (error) {
        console.warn("Failed to clear markers:", error);
      }
    }
  }, [history, move, evaluation, boardInstance]);

  return (
    <div
      ref={boardRef}
      className="chessboard-container h-full w-full"
      style={
        {
          "--highlight-from-color": "rgba(255, 255, 0, 0.5)",
          "--highlight-to-color": "rgba(0, 255, 0, 0.5)",
        } as React.CSSProperties
      }
    />
  );
}
