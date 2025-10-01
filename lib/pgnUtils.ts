/**
 * PGN Utility Functions
 * Handles cleaning and processing of PGN strings from various chess platforms
 */

export interface PgnCleaningOptions {
  removeClocks?: boolean;
  removeComments?: boolean;
  removeAnnotations?: boolean;
  removeNagCodes?: boolean;
  filterHeaders?: boolean;
  preserveHeaders?: string[];
}

const DEFAULT_OPTIONS: PgnCleaningOptions = {
  removeClocks: true,
  removeComments: true,
  removeAnnotations: true,
  removeNagCodes: true,
  filterHeaders: true,
  preserveHeaders: [
    'Event',
    'Site',
    'Date',
    'Round',
    'White',
    'Black',
    'Result',
    'ECO',
    'WhiteElo',
    'BlackElo',
    'Opening',
    'Variation'
  ]
};

/**
 * Standard headers that should typically be preserved in PGN
 */
const STANDARD_PGN_HEADERS = [
  'Event',
  'Site',
  'Date',
  'Round',
  'White',
  'Black',
  'Result'
];

/**
 * Chess.com specific headers that often cause parsing issues
 */
const CHESSCOM_PROBLEMATIC_HEADERS = [
  'CurrentPosition',
  'Timezone',
  'ECOUrl',
  'UTCDate',
  'UTCTime',
  'StartTime',
  'EndDate',
  'EndTime',
  'Link',
  'TimeControl',
  'Termination'
];

/**
 * Lichess specific headers that might cause issues
 */
const LICHESS_PROBLEMATIC_HEADERS = [
  'LichessURL',
  'TimeControl',
  'Termination'
];

/**
 * Clean Chess.com PGN format
 */
export function cleanChessComPgn(pgn: string, options: PgnCleaningOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  console.log("Starting Chess.com PGN cleaning...");
  console.log("Original PGN:", pgn);

  let cleaned = pgn.trim();

  // Remove Chess.com clock annotations
  if (opts.removeClocks) {
    cleaned = cleaned.replace(/\{\[%clk[^\}]*\]\}/g, "");
    cleaned = cleaned.replace(/\{\[%[^\}]*\]\}/g, "");
    cleaned = cleaned.replace(/\{\s*\}/g, "");
  }

  // Remove other annotations and comments
  if (opts.removeComments) {
    cleaned = cleaned.replace(/\([^)]*\)/g, ""); // Remove comments in parentheses
  }

  if (opts.removeNagCodes) {
    cleaned = cleaned.replace(/\$\d+/g, ""); // Remove NAG codes
  }

  if (opts.removeAnnotations) {
    cleaned = cleaned.replace(/[!?]+/g, ""); // Remove annotation symbols
  }

  // Split into lines and separate headers from moves
  const lines = cleaned.split(/\r?\n/);
  const headers = [];
  const moveLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      if (opts.filterHeaders) {
        // Extract header name
        const headerMatch = trimmed.match(/^\[([^"\s]+)/);
        const headerName = headerMatch ? headerMatch[1] : '';

        // Keep header if it's in preserve list or not in problematic list
        if (opts.preserveHeaders?.includes(headerName) ||
            !CHESSCOM_PROBLEMATIC_HEADERS.includes(headerName)) {
          headers.push(trimmed);
        }
      } else {
        headers.push(trimmed);
      }
    } else if (trimmed && !trimmed.startsWith("[")) {
      moveLines.push(trimmed);
    }
  }

  // Join moves with spaces and clean up extra whitespace
  let moves = moveLines.join(" ").replace(/\s+/g, " ").trim();

  // Ensure the game result is properly formatted at the end
  const resultPattern = /\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/;
  const resultMatch = moves.match(resultPattern);
  if (resultMatch) {
    moves = moves.replace(resultPattern, " " + resultMatch[1]);
  }

  // Construct properly formatted PGN with required blank line between headers and moves
  const result = headers.join("\n") + "\n\n" + moves;

  console.log("Cleaned Chess.com PGN:", result);
  return result;
}

/**
 * Clean Lichess PGN format
 */
export function cleanLichessPgn(pgn: string, options: PgnCleaningOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  console.log("Starting Lichess PGN cleaning...");

  let cleaned = pgn.trim();

  // Remove Lichess specific annotations
  if (opts.removeClocks) {
    cleaned = cleaned.replace(/\{\[%clk[^\}]*\]\}/g, "");
    cleaned = cleaned.replace(/\{\[%[^\}]*\]\}/g, "");
    cleaned = cleaned.replace(/\{\s*\}/g, "");
  }

  // Remove other annotations and comments
  if (opts.removeComments) {
    cleaned = cleaned.replace(/\([^)]*\)/g, "");
  }

  if (opts.removeNagCodes) {
    cleaned = cleaned.replace(/\$\d+/g, "");
  }

  if (opts.removeAnnotations) {
    cleaned = cleaned.replace(/[!?]+/g, "");
  }

  // Split into lines and separate headers from moves
  const lines = cleaned.split(/\r?\n/);
  const headers = [];
  const moveLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      if (opts.filterHeaders) {
        const headerMatch = trimmed.match(/^\[([^"\s]+)/);
        const headerName = headerMatch ? headerMatch[1] : '';

        if (opts.preserveHeaders?.includes(headerName) ||
            !LICHESS_PROBLEMATIC_HEADERS.includes(headerName)) {
          headers.push(trimmed);
        }
      } else {
        headers.push(trimmed);
      }
    } else if (trimmed && !trimmed.startsWith("[")) {
      moveLines.push(trimmed);
    }
  }

  let moves = moveLines.join(" ").replace(/\s+/g, " ").trim();

  // Ensure the game result is properly formatted
  const resultPattern = /\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/;
  const resultMatch = moves.match(resultPattern);
  if (resultMatch) {
    moves = moves.replace(resultPattern, " " + resultMatch[1]);
  }

  const result = headers.join("\n") + "\n\n" + moves;
  console.log("Cleaned Lichess PGN:", result);
  return result;
}

/**
 * Generic PGN cleaner that works for most formats
 */
export function cleanPgn(pgn: string, options: PgnCleaningOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  console.log("Starting generic PGN cleaning...");
  console.log("Original PGN:", pgn);

  let cleaned = pgn.trim();

  // Remove various types of annotations
  if (opts.removeClocks) {
    cleaned = cleaned.replace(/\{\[%clk[^\}]*\]\}/g, "");
    cleaned = cleaned.replace(/\{\[%[^\}]*\]\}/g, "");
    cleaned = cleaned.replace(/\{\s*\}/g, "");
  }

  if (opts.removeComments) {
    cleaned = cleaned.replace(/\{[^}]*\}/g, ""); // Remove comments in braces
    cleaned = cleaned.replace(/\([^)]*\)/g, ""); // Remove comments in parentheses
  }

  if (opts.removeNagCodes) {
    cleaned = cleaned.replace(/\$\d+/g, ""); // Remove NAG codes
  }

  if (opts.removeAnnotations) {
    cleaned = cleaned.replace(/[!?]+/g, ""); // Remove annotation symbols
  }

  // Split into lines and separate headers from moves
  const lines = cleaned.split(/\r?\n/);
  const headers = [];
  const moveLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      if (opts.filterHeaders) {
        const headerMatch = trimmed.match(/^\[([^"\s]+)/);
        const headerName = headerMatch ? headerMatch[1] : '';

        if (opts.preserveHeaders?.includes(headerName)) {
          headers.push(trimmed);
        }
      } else {
        headers.push(trimmed);
      }
    } else if (trimmed && !trimmed.startsWith("[")) {
      moveLines.push(trimmed);
    }
  }

  let moves = moveLines.join(" ").replace(/\s+/g, " ").trim();

  // Ensure the game result is properly formatted
  const resultPattern = /\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/;
  const resultMatch = moves.match(resultPattern);
  if (resultMatch) {
    moves = moves.replace(resultPattern, " " + resultMatch[1]);
  }

  const result = headers.join("\n") + "\n\n" + moves;
  console.log("Cleaned PGN:", result);
  return result;
}

/**
 * Auto-detect platform and clean accordingly
 */
export function autoCleanPgn(pgn: string, options: PgnCleaningOptions = {}): string {
  // Detect Chess.com PGN
  if (pgn.includes("[Site \"Chess.com\"]") || pgn.includes("%clk")) {
    return cleanChessComPgn(pgn, options);
  }

  // Detect Lichess PGN
  if (pgn.includes("[Site \"https://lichess.org")) {
    return cleanLichessPgn(pgn, options);
  }

  // Default to generic cleaner
  return cleanPgn(pgn, options);
}

/**
 * Validate if a PGN string is properly formatted
 */
export function validatePgn(pgn: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!pgn || !pgn.trim()) {
    errors.push("PGN is empty");
    return { isValid: false, errors };
  }

  const lines = pgn.trim().split(/\r?\n/);
  let hasHeaders = false;
  let hasMoves = false;
  let inMoves = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      if (inMoves) {
        errors.push("Headers found after moves section");
      }
      hasHeaders = true;
    } else if (trimmed && !trimmed.startsWith("[")) {
      inMoves = true;
      hasMoves = true;
    }
  }

  if (!hasHeaders) {
    errors.push("No PGN headers found");
  }

  if (!hasMoves) {
    errors.push("No moves found");
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Extract only the moves from a PGN string
 */
export function extractMoves(pgn: string): string {
  const lines = pgn.trim().split(/\r?\n/);
  const moveLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("[")) {
      moveLines.push(trimmed);
    }
  }

  return moveLines.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Extract headers from a PGN string
 */
export function extractHeaders(pgn: string): Record<string, string> {
  const headers: Record<string, string> = {};
  const lines = pgn.trim().split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const match = trimmed.match(/^\[([^"\s]+)\s+"([^"]*)"\]$/);
      if (match) {
        headers[match[1]] = match[2];
      }
    }
  }

  return headers;
}
