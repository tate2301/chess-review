/**
 * Example usage of PGN cleaning utilities
 * This file demonstrates how to use the various PGN cleaning functions
 * with real Chess.com and other PGN formats.
 */

import {
  cleanChessComPgn,
  cleanLichessPgn,
  cleanPgn,
  autoCleanPgn,
  validatePgn,
  extractMoves,
  extractHeaders,
  type PgnCleaningOptions
} from '../lib/pgnUtils';

// Sample Chess.com PGN with clock annotations and extra headers
const chessComPgn = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2025.08.01"]
[Round "-"]
[White "kamfeskaya12"]
[Black "slavikrtn"]
[Result "1-0"]
[CurrentPosition "r3k1nr/1p4Qp/4p3/PpppP3/1b6/8/1PPB1PPP/R3K2R b KQkq - 0 16"]
[Timezone "UTC"]
[ECO "B00"]
[ECOUrl "https://www.chess.com/openings/Nimzowitsch-Defense-2.d4-e6-3.Nf3-d5-4.e5"]
[UTCDate "2025.08.01"]
[UTCTime "10:06:08"]
[WhiteElo "871"]
[BlackElo "863"]
[TimeControl "600"]
[Termination "kamfeskaya12 won by resignation"]
[StartTime "10:06:08"]
[EndDate "2025.08.01"]
[EndTime "10:11:21"]
[Link "https://www.chess.com/game/live/141354708810"]

1. e4 {[%clk 0:09:52.8]} 1... d5 {[%clk 0:09:58.5]} 2. e5 {[%clk 0:09:48.2]} 2... e6 {[%clk 0:09:57.8]} 3. d4 {[%clk 0:09:45.2]} 3... Nc6 {[%clk 0:09:57]} 4. Nf3 {[%clk 0:09:41.6]} 4... Be7 {[%clk 0:09:56.2]} 5. a4 {[%clk 0:09:35.4]} 5... f6 {[%clk 0:09:55.5]} 6. Bb5 {[%clk 0:09:15.6]} 6... Bd7 {[%clk 0:09:50.3]} 7. Bd2 {[%clk 0:08:58.4]} 7... fxe5 {[%clk 0:09:37.4]} 8. dxe5 {[%clk 0:08:50.8]} 8... a6 {[%clk 0:09:26]} 9. Bxc6 {[%clk 0:08:45.2]} 9... Bxc6 {[%clk 0:09:23.3]} 10. Nd4 {[%clk 0:08:42]} 10... Qd7 {[%clk 0:09:03.7]} 11. a5 {[%clk 0:08:25.7]} 11... Bb5 {[%clk 0:08:07.7]} 12. Nc3 {[%clk 0:08:10.2]} 12... Bb4 {[%clk 0:07:56.3]} 13. Qg4 {[%clk 0:07:56.4]} 13... c5 {[%clk 0:07:30.5]} 14. Ndxb5 {[%clk 0:07:48.2]} 14... Qxb5 {[%clk 0:07:26.3]} 15. Nxb5 {[%clk 0:07:42.9]} 15... axb5 {[%clk 0:07:22.1]} 16. Qxg7 {[%clk 0:07:38.4]} 1-0`;

// Sample Lichess PGN
const lichessPgn = `[Event "Rated Blitz game"]
[Site "https://lichess.org/abc123"]
[Date "2025.08.01"]
[White "player1"]
[Black "player2"]
[Result "1-0"]
[UTCDate "2025.08.01"]
[UTCTime "12:00:00"]
[WhiteElo "1500"]
[BlackElo "1480"]
[WhiteRatingDiff "+12"]
[BlackRatingDiff "-12"]
[Variant "Standard"]
[TimeControl "300+0"]
[ECO "C50"]
[Opening "Italian Game"]
[Termination "Normal"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Be7 4. d3 d6 5. Ng5 Bxg5 6. Bxg5 Qd7 7. Qh5 h6 8. Bh4 g6 9. Qf3 f5 10. exf5 gxf5 11. Bg3 Nf6 12. h3 Rg8 13. O-O-O Rxg3 14. fxg3 Ne7 15. g4 fxg4 16. hxg4 Nxg4 17. Qf7# 1-0`;

// Generic PGN with annotations
const annotatedPgn = `[Event "Test Game"]
[Site "Test"]
[Date "2025.01.01"]
[White "White Player"]
[Black "Black Player"]
[Result "1-0"]

1. e4! (Best move) e5 2. Nf3 $1 Nc6? {A mistake} 3. Bb5!! a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 1-0`;

export function demonstratePgnCleaning() {
  console.log("=== PGN Cleaning Examples ===\n");

  // Example 1: Clean Chess.com PGN with default options
  console.log("1. Chess.com PGN Cleaning (default options):");
  const cleanedChessCom = cleanChessComPgn(chessComPgn);
  console.log("Cleaned:", cleanedChessCom);
  console.log("\n");

  // Example 2: Clean Chess.com PGN with custom options
  console.log("2. Chess.com PGN Cleaning (preserve all headers):");
  const customOptions: PgnCleaningOptions = {
    filterHeaders: false,
    removeClocks: true,
    removeComments: true
  };
  const cleanedChessComCustom = cleanChessComPgn(chessComPgn, customOptions);
  console.log("Cleaned with custom options:", cleanedChessComCustom);
  console.log("\n");

  // Example 3: Auto-detect and clean
  console.log("3. Auto-detect platform and clean:");
  const autoCleanedChessCom = autoCleanPgn(chessComPgn);
  const autoCleanedLichess = autoCleanPgn(lichessPgn);
  console.log("Auto-cleaned Chess.com:", autoCleanedChessCom);
  console.log("Auto-cleaned Lichess:", autoCleanedLichess);
  console.log("\n");

  // Example 4: Clean annotated PGN
  console.log("4. Generic PGN with annotations:");
  const cleanedAnnotated = cleanPgn(annotatedPgn, {
    removeComments: true,
    removeAnnotations: true,
    removeNagCodes: true
  });
  console.log("Original annotated PGN:", annotatedPgn);
  console.log("Cleaned annotated PGN:", cleanedAnnotated);
  console.log("\n");

  // Example 5: Validate PGN
  console.log("5. PGN Validation:");
  const validationResult = validatePgn(cleanedChessCom);
  console.log("Is valid:", validationResult.isValid);
  console.log("Errors:", validationResult.errors);
  console.log("\n");

  // Example 6: Extract components
  console.log("6. Extract PGN Components:");
  const moves = extractMoves(cleanedChessCom);
  const headers = extractHeaders(cleanedChessCom);
  console.log("Extracted moves:", moves);
  console.log("Extracted headers:", headers);
  console.log("\n");

  // Example 7: Different cleaning levels
  console.log("7. Different cleaning levels:");

  // Minimal cleaning (keep everything except clocks)
  const minimalCleaning = cleanChessComPgn(chessComPgn, {
    removeClocks: true,
    removeComments: false,
    removeAnnotations: false,
    removeNagCodes: false,
    filterHeaders: false
  });

  // Aggressive cleaning (remove everything except essential)
  const aggressiveCleaning = cleanChessComPgn(chessComPgn, {
    removeClocks: true,
    removeComments: true,
    removeAnnotations: true,
    removeNagCodes: true,
    filterHeaders: true,
    preserveHeaders: ['Event', 'Site', 'Date', 'White', 'Black', 'Result']
  });

  console.log("Minimal cleaning:", minimalCleaning);
  console.log("Aggressive cleaning:", aggressiveCleaning);
}

// Usage examples for different scenarios
export const usageExamples = {
  // For chess analysis apps
  forAnalysis: () => {
    return autoCleanPgn(chessComPgn, {
      removeClocks: true,
      removeComments: true,
      removeAnnotations: false, // Keep annotations for analysis
      filterHeaders: true,
      preserveHeaders: ['Event', 'Site', 'Date', 'White', 'Black', 'Result', 'ECO', 'WhiteElo', 'BlackElo']
    });
  },

  // For database storage
  forDatabase: () => {
    return autoCleanPgn(chessComPgn, {
      removeClocks: true,
      removeComments: true,
      removeAnnotations: true,
      filterHeaders: true,
      preserveHeaders: ['Event', 'Site', 'Date', 'White', 'Black', 'Result']
    });
  },

  // For display purposes
  forDisplay: () => {
    return autoCleanPgn(chessComPgn, {
      removeClocks: true,
      removeComments: false, // Keep comments for display
      removeAnnotations: false, // Keep annotations for display
      filterHeaders: true,
      preserveHeaders: ['Event', 'Site', 'Date', 'White', 'Black', 'Result', 'WhiteElo', 'BlackElo']
    });
  },

  // Minimal processing (just remove clocks)
  minimal: () => {
    return cleanChessComPgn(chessComPgn, {
      removeClocks: true,
      removeComments: false,
      removeAnnotations: false,
      filterHeaders: false
    });
  }
};

// Run demonstration if this file is executed directly
if (typeof window === 'undefined') {
  // demonstratePgnCleaning();
}
