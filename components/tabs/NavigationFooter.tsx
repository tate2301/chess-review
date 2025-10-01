"use client";

import { useEffect } from "react";
import { useChessStore } from "../../hooks/useChessStore";
import { Button } from "../ui/button";

export default function NavigationFooter() {
  const {
    state,
    navigateBackward,
    navigateForward,
    navigatePrevious,
    navigateNext,
  } = useChessStore();
  const { move, history } = state;
  const nbMoves = history.length;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent keyboard navigation if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (move > -1 && nbMoves > 0) {
            navigatePrevious();
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (move < nbMoves - 1 && nbMoves > 0) {
            navigateNext();
          }
          break;
        case "Home":
          event.preventDefault();
          if (nbMoves > 0) {
            navigateBackward();
          }
          break;
        case "End":
          event.preventDefault();
          if (nbMoves > 0) {
            navigateForward();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    move,
    nbMoves,
    navigateBackward,
    navigateForward,
    navigatePrevious,
    navigateNext,
  ]);

  return (
    <div className="flex gap-2 justify-between">
      <Button
        variant={"default"}
        onClick={navigateBackward}
        disabled={nbMoves === 0}
        title="Go to start (Home)"
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M7 6a1 1 0 0 1 2 0v4l6.4-4.8A1 1 0 0 1 17 6v12a1 1 0 0 1-1.6.8L9 14v4a1 1 0 1 1-2 0V6Z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
      <Button
        variant={"default"}
        onClick={navigatePrevious}
        disabled={move <= -1 || nbMoves === 0}
        title="Previous move (←)"
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m15 19-7-7 7-7"
          />
        </svg>
      </Button>
      <Button
        variant={"default"}
        onClick={navigateNext}
        disabled={move >= nbMoves - 1 || nbMoves === 0}
        title="Next move (→)"
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m9 5 7 7-7 7"
          />
        </svg>
      </Button>
      <Button
        variant={"default"}
        onClick={navigateForward}
        disabled={nbMoves === 0}
        title="Go to end (End)"
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M17 6a1 1 0 1 0-2 0v4L8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8L15 14v4a1 1 0 1 0 2 0V6Z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
    </div>
  );
}
