import type { RawEval } from "../types/Engine";
import {
  EVAL_CHECKMATE_BLACK,
  EVAL_CHECKMATE_WHITE,
  type Evaluation,
} from "../types/Evaluation";
import Label from "../types/Label";
import type { Chess, Move } from "chess.js";
import {
  computeWinChanceLost,
  isForced,
  isNextMoveCrucial,
  haveOnlyOneGoodMove,
  isSacrifice,
  opponentDidABadPlay,
  getBestMove,
} from "./evaluation";

export async function init(engine: string) {
  const engineFiles: { [key: string]: string } = {
    "lite-multi": "stockfish-17-lite.js",
    "lite-single": "stockfish-17-lite-single.js",
    "large-multi": "stockfish-17.js",
    "large-single": "stockfish-17-single.js",
  };

  const worker = new Worker(("/stockfish/" + engineFiles[engine]) as string);

  worker.onmessage = ({ data }: any) =>
    console.log(`page got message: ${data}`);
  worker.onerror = (ev: any) => console.log(`page got error: ${ev.message}`);

  if (engine.includes("multi")) {
    worker.postMessage(
      `setoption name Threads value ${window.navigator.hardwareConcurrency}`,
    );
  }
  worker.postMessage(`setoption name MultiPV value 2`);
  worker.postMessage(`setoption name Move Overhead value 0`);

  worker.postMessage("isready");
  worker.postMessage("uci");
  worker.postMessage("ucinewgame");

  return worker;
}

export async function analyze_game(
  worker: Worker,
  history: Move[],
  chess: Chess,
  depth: number,
  setProgress: (n: number, move?: string) => void,
): Promise<Evaluation[]> {
  const evaluations: Evaluation[] = [];
  const rawEvals: RawEval[] = [];
  let mayBeGreat = false;
  const start = performance.now();
  const length = history.length;
  let rawPromise;

  for (let i = 0; i < history.length; i++) {
    rawPromise = evaluate(worker, history[i].after, depth);
    const progressPercent = Math.min(Math.floor((i / length) * 50), 49);
    setProgress(progressPercent, history[i].san);
    rawEvals.push(await rawPromise);
  }

  const mid = performance.now();

  for (let i = 0; i < history.length; i++) {
    mayBeGreat =
      isNextMoveCrucial(
        history[i].color,
        evaluations.at(-2),
        evaluations.at(-1),
      ) || haveOnlyOneGoodMove(history[i].color, evaluations.at(-1));
    evaluations.push(
      analyze_move(
        history[i],
        rawEvals[i],
        chess,
        evaluations.at(-1),
        mayBeGreat,
      ),
    );
    const progressPercent = Math.min(50 + Math.floor((i / length) * 50), 99);
    setProgress(progressPercent, `Evaluating ${history[i].san}`);
  }
  setProgress(100);
  const end = performance.now();
  console.log(`Execution engine time: ${mid - start} ms`);
  console.log(`Execution labeling time: ${end - mid} ms`);
  console.log(`Execution total time: ${end - start} ms`);
  return evaluations;
}

export function analyze_move(
  move: Move,
  rawEval: RawEval,
  chess: Chess,
  previousEval: Evaluation | undefined,
  mayBeGreat: boolean,
): Evaluation {
  chess.load(move.after);
  const turn = chess.turn();
  const best = getBestMove(previousEval);

  if (chess.isCheckmate()) {
    return turn === "b" ? EVAL_CHECKMATE_WHITE : EVAL_CHECKMATE_BLACK;
  }

  // Reverse when black
  rawEval.score = turn === "w" ? rawEval.score : -rawEval.score;

  if (rawEval.altLine && turn === "b") {
    rawEval.altLine.score = -rawEval.altLine.score;
  }

  let label;

  // Compute label
  // Check for BOOK
  if (!previousEval || previousEval.label === Label.BOOK) {
    // TODO: Implement opening book lookup
    // const openingName: string | undefined = OPENINGS[chess.fen() as keyof typeof OPENINGS];
    // if (openingName) {
    //   return {
    //     ...rawEval,
    //     label: Label.BOOK,
    //     opening: openingName
    //   };
    // }
  }

  // Check for BEST
  if (move.lan === best) {
    label = Label.BEST;
  }

  const winChanceLost = previousEval
    ? turn === "b"
      ? computeWinChanceLost(previousEval, rawEval)
      : -computeWinChanceLost(previousEval, rawEval)
    : 0;

  // Check for EXCELLENT, GOOD, INACCURACY, MISTAKE or BLUNDER
  if (label === undefined) {
    if (!previousEval) {
      // First move - assign a default label
      label = Label.UNDEFINED;
    } else {
      if (winChanceLost <= 2) {
        label = Label.EXCELLENT;
      } else if (winChanceLost <= 5) {
        label = Label.GOOD;
      } else if (winChanceLost <= 10) {
        label = Label.INACCURACY;
      } else if (winChanceLost <= 20) {
        label = Label.MISTAKE;
      } else {
        label = Label.BLUNDER;
      }
    }
  }

  // Check for FORCED, GREAT or BRILLIANT
  if (label === Label.BEST && previousEval) {
    if (isForced(previousEval)) {
      label = Label.FORCED;
    } else if (isSacrifice(chess, move)) {
      label = Label.BRILLIANT;
    } else if (mayBeGreat) {
      label = Label.GREAT;
    }
  }

  // Check for MISSED
  if (previousEval && opponentDidABadPlay(previousEval) && winChanceLost >= 5) {
    label = Label.MISSED;
  }

  return {
    ...rawEval,
    label,
    best,
  };
}

const REGEX_MATCH =
  /multipv (\d+) score (\w+) (-?\d+) nodes \d+ nps \d+(?: hashfull \d+)? time \d+ pv (.*)/;

export function evaluate(
  worker: Worker,
  fen: string,
  depth: number,
): Promise<RawEval> {
  return new Promise((resolve) => {
    const regexInfo = new RegExp(`^info depth ${depth} seldepth \\d+ multipv`);
    let result: any = {};

    const messageHandler = ({ data }: { data: string }) => {
      if (regexInfo.test(data)) {
        const match = data.match(REGEX_MATCH);
        if (!match) {
          throw new Error(`REGEX_MATCH failed: ${data}`);
        }
        // Info best line
        if (match.at(1) === "1") {
          result = {
            ...result,
            type: match.at(2),
            score: parseInt(match.at(3)!),
            pv: match.at(4),
            data,
          };
        } else {
          // Alt line
          result.altLine = {
            type: match.at(2),
            score: parseInt(match.at(3)!),
            pv: match.at(4),
          };
        }
      }
      // Last message
      else if (data.startsWith("bestmove")) {
        worker.removeEventListener("message", messageHandler);
        resolve(result);
      }
    };

    worker.addEventListener("message", messageHandler);
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);
  });
}
