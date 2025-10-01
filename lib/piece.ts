/**
 * Utility functions for chess piece handling
 */

/**
 * Determines the color of a piece based on the move index
 * @param moveIndex - The index of the move in the history (0-based)
 * @returns "white" for even indices (white moves), "black" for odd indices (black moves)
 */
export function getPieceColorFromMoveIndex(
  moveIndex: number,
): "white" | "black" {
  return moveIndex % 2 === 0 ? "white" : "black";
}
