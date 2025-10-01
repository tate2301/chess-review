export const loadRecentGames = async (username: string) => {
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currentYear = today.getFullYear();

  let url = `https://api.chess.com/pub/player/${username}/games/${currentYear}/${currentMonth}`;

  console.log(`Loading games for ${username} from ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `Player "${username}" not found or has no games this month.`,
        );
      } else if (response.status === 429) {
        throw new Error(
          "Too many requests. Please wait a moment and try again.",
        );
      } else {
        throw new Error(
          `Failed to load games: ${response.status} ${response.statusText}`,
        );
      }
    }

    const payload = await response.json();

    if (!payload.games || payload.games.length === 0) {
      // Try previous month if current month has no games
      const prevMonth = today.getMonth() === 0 ? 12 : today.getMonth();
      const prevYear = today.getMonth() === 0 ? currentYear - 1 : currentYear;
      const prevMonthStr = String(prevMonth).padStart(2, "0");

      url = `https://api.chess.com/pub/player/${username}/games/${prevYear}/${prevMonthStr}`;
      console.log(`No games this month, trying previous month: ${url}`);

      const prevResponse = await fetch(url);
      if (prevResponse.ok) {
        const prevPayload = await prevResponse.json();
        if (prevPayload.games && prevPayload.games.length > 0) {
          console.log(
            `Found ${prevPayload.games.length} games from previous month`,
          );
          return prevPayload.games;
        }
      }

      throw new Error(
        `No games found for player "${username}" in recent months.`,
      );
    }

    console.log(`Found ${payload.games.length} games for ${username}`);

    // Filter out games without PGN
    const gamesWithPgn = payload.games.filter(
      (game: any) => game.pgn && game.pgn.trim(),
    );

    if (gamesWithPgn.length === 0) {
      throw new Error(
        "No games with PGN data found. Please try a different player.",
      );
    }

    console.log(`${gamesWithPgn.length} games have PGN data`);
    return gamesWithPgn;
  } catch (error: any) {
    console.error("Error loading Chess.com games:", error);

    if (error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check your connection and try again.",
      );
    }

    throw error;
  }
};

export const userWon = (username: string, game: any) =>
  (game.white.username === username && game.white.result === "win") ||
  (game.black.username === username && game.black.result === "win");

export const isDraw = (game: any) =>
  game.white.result !== "win" && game.black.result !== "win";
