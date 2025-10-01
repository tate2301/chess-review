"use client";

import { useState, useEffect } from "react";
import { useChessStore } from "../../hooks/useChessStore";
import { loadRecentGames } from "../../lib/api";
import { cleanChessComPgn, autoCleanPgn } from "../../lib/pgnUtils";
import ChessComGameSelectionModal from "../modals/ChessComGameSelectionModal";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface LoadTabProps {
  onChange: (pgn: string) => void;
  analyze: () => void;
  isLoading: boolean;
}

const TEST_PGN = `[Event "Live Chess"]
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

export default function LoadTab({
  onChange,
  analyze,
  isLoading,
}: LoadTabProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loader, setLoader] = useState("chesscom");
  const [strPgn, setStrPgn] = useState("");
  const [disabledImportPgn, setDisabledImportPgn] = useState(false);
  const [filename, setFilename] = useState("");
  const [disabledSearchUsername, setDisabledSearchUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [showGameSelection, setShowGameSelection] = useState(false);
  const [games, setGames] = useState<any[]>([]);

  const { updateSettings } = useChessStore();

  const onUsernameSearch = async () => {
    const trimmedUsername = username.trim();
    const regex = /^[A-Za-z0-9_]{3,}$/;

    if (regex.test(trimmedUsername)) {
      setDisabledSearchUsername(true);
      try {
        const userGames = await loadRecentGames(trimmedUsername);

        if (userGames?.length) {
          setGames(userGames);
          setShowGameSelection(true);
        } else {
          alert("No game found or username is invalid.");
          setDisabledSearchUsername(false);
        }
      } catch (error) {
        alert("Error loading games. Please try again.");
        setDisabledSearchUsername(false);
      }
    } else {
      alert("Username is invalid.");
    }
  };

  const onKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await onUsernameSearch();
    }
  };

  const onGameSelected = (game: any, orientation: "w" | "b") => {
    if (!game.pgn) {
      alert("Selected game has no PGN data. Please try another game.");
      return;
    }
    console.log("Game selected:", game);
    console.log("PGN:", game.pgn);
    setStrPgn(game.pgn);
    onChange(game.pgn);
    updateSettings({ orientation });
    setShowGameSelection(false);
    setDisabledSearchUsername(false);
    // Don't auto-analyze here, let user click Analyze button
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDisabledImportPgn(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (!content.trim()) {
          alert("File is empty or could not be read.");
          setDisabledImportPgn(false);
          return;
        }
        // Clean the uploaded PGN
        const cleanedContent = autoCleanPgn(content);
        setStrPgn(cleanedContent);
        setFilename(file.name);
        setDisabledImportPgn(false);
      };
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
        setDisabledImportPgn(false);
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    onChange(strPgn);
    // Reset disabled state when PGN changes
    if (strPgn.trim() && disabledImportPgn) {
      setDisabledImportPgn(false);
    }
  }, [strPgn, onChange, disabledImportPgn]);

  return (
    <>
      <div className="flex items-center mb-4">
        <label htmlFor="loader" className="mr-2 text-mercury-fg text-sm">
          Provider
        </label>
        <Select
          name="loader"
          value={loader}
          onValueChange={(value: string) => {
            setLoader(value);
            // Clear PGN when switching loader types
            if (value !== "pgn") {
              setStrPgn("");
              setFilename("");
            }
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pgn">PGN</SelectItem>
            <SelectItem value="chesscom">chess.com</SelectItem>
            <SelectItem value="lichess">lichess.org</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="my-8">
        {loader === "pgn" && (
          <>
            <Textarea
              value={strPgn}
              onChange={(e) => setStrPgn(e.target.value)}
              className="textarea p-2 w-full"
              rows={4}
              placeholder="1. e4 Nc6 2. Bc4 Nf6 3. Nc3 e6 4. Nf3 d5 5. e5 Nd7..."
              disabled={disabledImportPgn || isLoading}
            />
            <hr className="my-4" />
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pgn,.txt"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="file-button"
              />
              {filename && <p className="truncate text-sm">{filename}</p>}
            </div>
          </>
        )}

        {loader === "chesscom" && (
          <div className="space-y-3">
            <div className="flex space-x-2 items-center">
              <Label>Username</Label>
              <div className="input-group flex-1 input-group-divider flex">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="magnuscarlsen"
                  onKeyDown={onKeyDown}
                  disabled={isLoading}
                  className="mr-2"
                />
                <Button
                  variant={"secondary"}
                  onClick={onUsernameSearch}
                  disabled={
                    disabledSearchUsername || isLoading || !username.trim()
                  }
                >
                  {disabledSearchUsername ? "⏳" : "🔍"}
                </Button>
              </div>
            </div>
            {strPgn && (
              <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ Game loaded! Click "Analyze" to start analysis.
                </p>
              </div>
            )}
          </div>
        )}

        {loader === "lichess" && (
          <h3 className="text-xl text-center">🚧 Sorry, WIP 🚧</h3>
        )}
      </div>

      {/* Test PGN Section */}
      <div className="mt-6 p-4 bg-secondary text-secondary-foreground rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Quick Test</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Load a sample game for testing the analysis features
        </p>
        <Button
          type="button"
          variant={"default"}
          className="w-full px-4 py-2 rounded-lg transition-colors"
          onClick={() => {
            console.log("Loading test PGN:", TEST_PGN);
            const cleanedPgn = cleanChessComPgn(TEST_PGN);
            setStrPgn(cleanedPgn);
            onChange(cleanedPgn);
          }}
          disabled={isLoading}
        >
          Load Test Game
        </Button>
      </div>

      {showGameSelection && (
        <ChessComGameSelectionModal
          games={games.reverse()}
          username={username}
          onGameSelected={onGameSelected}
          onClose={() => {
            setShowGameSelection(false);
            setDisabledSearchUsername(false);
          }}
        />
      )}
    </>
  );
}
