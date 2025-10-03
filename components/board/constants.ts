export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

export const ASSET_MAP: Record<string, string> = {
  // white
  wP: "/media/pieces/wp.svg",
  wN: "/media/pieces/wn.svg",
  wB: "/media/pieces/wb.svg",
  wR: "/media/pieces/wr.svg",
  wQ: "/media/pieces/wq.svg",
  wK: "/media/pieces/wk.svg",
  // black
  bP: "/media/pieces/bp.svg",
  bN: "/media/pieces/bn.svg",
  bB: "/media/pieces/bb.svg",
  bR: "/media/pieces/br.svg",
  bQ: "/media/pieces/bq.svg",
  bK: "/media/pieces/bk.svg",
};

export const themeVariables = {
  green: {
    "--sq-light": "#F3F3F4",
    "--sq-dark": "#6A9B41",
  },
  mono: {
    "--sq-light": "#ABA293",
    "--sq-dark": "#928A7F",
  },
};
