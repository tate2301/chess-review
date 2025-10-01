"use client";

import { useChessStore } from "../../hooks/useChessStore";
import { Button } from "../ui/button";

interface ButtonFooterProps {
  onClick: (event: React.MouseEvent) => void;
  isLoading?: boolean;
  progress?: number;
}

export default function ButtonFooter({
  onClick,
  isLoading = false,
  progress = 0,
}: ButtonFooterProps) {
  const { state } = useChessStore();
  const { engine } = state;

  const isDisabled = isLoading || !engine;
  return (
    <>
      {!engine && (
        <div className="text-center text-sm text-amber-600 dark:text-amber-400">
          ⚠️ Loading chess engine...
        </div>
      )}
      <Button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        variant={"accent"}
        className="w-full"
        title={
          !engine ? "Chess engine is loading..." : "Analyze the loaded game"
        }
      >
        {isLoading ? "..." : !engine ? "Loading Engine" : <>🚀 Analyze game</>}
      </Button>
    </>
  );
}
