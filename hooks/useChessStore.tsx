"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { Chess, DEFAULT_POSITION, type Move } from "chess.js";
import type { Evaluation } from "../types/Evaluation";
import type { Settings } from "../types/Settings";
import Label from "../types/Label";

interface ChessState {
  chess: Chess;
  position: string;
  move: number;
  history: Move[];
  evaluations: Evaluation[];
  evaluation: Evaluation;
  settings: Settings;
  engine: Worker | null;
}

type ChessAction =
  | { type: "SET_POSITION"; payload: string }
  | { type: "SET_MOVE"; payload: number }
  | { type: "SET_HISTORY"; payload: Move[] }
  | { type: "SET_EVALUATIONS"; payload: Evaluation[] }
  | { type: "UPDATE_SETTINGS"; payload: Partial<Settings> }
  | { type: "SET_ENGINE"; payload: Worker }
  | { type: "RESET_GAME" };

const initialState: ChessState = {
  chess: new Chess(),
  position: DEFAULT_POSITION,
  move: -1,
  history: [],
  evaluations: [],
  evaluation: {
    score: 0,
    type: "cp",
    pv: "",
    label: Label.UNDEFINED,
  },
  settings: {
    orientation: "w",
    depth: 8,
    engine: "lite-multi",
  },
  engine: null,
};

function chessReducer(state: ChessState, action: ChessAction): ChessState {
  switch (action.type) {
    case "SET_POSITION":
      return { ...state, position: action.payload };

    case "SET_MOVE":
      const newMove = action.payload;
      let newEvaluation = state.evaluation;

      if (newMove >= 0 && state.evaluations.length > newMove) {
        newEvaluation = state.evaluations[newMove];
      } else {
        newEvaluation = {
          score: 0,
          type: "cp",
          pv: "",
          label: Label.UNDEFINED,
        };
      }

      return {
        ...state,
        move: newMove,
        evaluation: newEvaluation,
      };

    case "SET_HISTORY":
      return { ...state, history: action.payload };

    case "SET_EVALUATIONS":
      return { ...state, evaluations: action.payload };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case "SET_ENGINE":
      return { ...state, engine: action.payload };

    case "RESET_GAME":
      return {
        ...state,
        chess: new Chess(),
        position: DEFAULT_POSITION,
        move: -1,
        history: [],
        evaluations: [],
        evaluation: {
          score: 0,
          type: "cp",
          pv: "",
          label: Label.UNDEFINED,
        },
      };

    default:
      return state;
  }
}

interface ChessContextType {
  state: ChessState;
  setPosition: (position: string) => void;
  setMove: (move: number) => void;
  setHistory: (history: Move[]) => void;
  setEvaluations: (evaluations: Evaluation[]) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setEngine: (engine: Worker) => void;
  resetGame: () => void;
  navigateToMove: (moveIndex: number) => void;
  navigateBackward: () => void;
  navigateForward: () => void;
  navigatePrevious: () => void;
  navigateNext: () => void;
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

interface ChessProviderProps {
  children: ReactNode;
}

export function ChessProvider({ children }: ChessProviderProps) {
  const [state, dispatch] = useReducer(chessReducer, initialState);

  const setPosition = useCallback((position: string) => {
    dispatch({ type: "SET_POSITION", payload: position });
  }, []);

  const setMove = useCallback((move: number) => {
    dispatch({ type: "SET_MOVE", payload: move });
  }, []);

  const setHistory = useCallback((history: Move[]) => {
    dispatch({ type: "SET_HISTORY", payload: history });
  }, []);

  const setEvaluations = useCallback((evaluations: Evaluation[]) => {
    dispatch({ type: "SET_EVALUATIONS", payload: evaluations });
  }, []);

  const updateSettings = useCallback((settings: Partial<Settings>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
  }, []);

  const setEngine = useCallback((engine: Worker) => {
    dispatch({ type: "SET_ENGINE", payload: engine });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const navigateToMove = useCallback(
    (moveIndex: number) => {
      if (state.history.length === 0) return;

      if (moveIndex < 0) {
        // Go to starting position
        setMove(-1);
        setPosition(state.history[0].before || DEFAULT_POSITION);
        return;
      }

      if (moveIndex >= state.history.length) return;

      setMove(moveIndex);
      setPosition(state.history[moveIndex].after);
    },
    [state.history, setMove, setPosition],
  );

  const navigateBackward = useCallback(() => {
    if (state.history.length === 0) return;

    setMove(-1);
    setPosition(state.history[0].before || DEFAULT_POSITION);
  }, [state.history, setPosition, setMove]);

  const navigateForward = useCallback(() => {
    if (state.history.length === 0) return;

    const lastIndex = state.history.length - 1;
    setMove(lastIndex);
    setPosition(state.history[lastIndex].after);
  }, [state.history, setMove, setPosition]);

  const navigatePrevious = useCallback(() => {
    if (state.history.length === 0) return;

    const newMove = state.move - 1;
    if (newMove < -1) return; // Can't go before starting position

    if (newMove === -1) {
      setMove(-1);
      setPosition(state.history[0].before || DEFAULT_POSITION);
    } else {
      setMove(newMove);
      setPosition(state.history[newMove].after);
    }
  }, [state.move, state.history, setPosition, setMove]);

  const navigateNext = useCallback(() => {
    if (state.history.length === 0) return;

    const newMove = state.move + 1;
    if (newMove >= state.history.length) return; // Can't go past last move

    setMove(newMove);
    setPosition(state.history[newMove].after);
  }, [state.move, state.history, setMove, setPosition]);

  const value: ChessContextType = {
    state,
    setPosition,
    setMove,
    setHistory,
    setEvaluations,
    updateSettings,
    setEngine,
    resetGame,
    navigateToMove,
    navigateBackward,
    navigateForward,
    navigatePrevious,
    navigateNext,
  };

  return (
    <ChessContext.Provider value={value}>{children}</ChessContext.Provider>
  );
}

export function useChessStore() {
  const context = useContext(ChessContext);
  if (context === undefined) {
    throw new Error("useChessStore must be used within a ChessProvider");
  }
  return context;
}
