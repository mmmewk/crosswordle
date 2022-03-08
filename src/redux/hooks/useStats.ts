import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export const useStats = () => {
  const { streak, maxStreak } = useSelector((state: RootState) => state.stats);
  const { gameWins, shareHistories, lostCells } = useSelector((state: RootState) => state.wordle);
  const totalGamesWon = useMemo(() => Object.values(gameWins).filter(Boolean).length, [gameWins]);
  const totalGamesLost = useMemo(() => Object.values(lostCells).filter(Boolean).length, [lostCells]);
  const averageGuesses = useMemo(() => {
    let totalGuesses = 0;
    Object.keys(shareHistories).forEach((index: string) => {
      if (gameWins[Number(index)] || lostCells[Number(index)]) totalGuesses += shareHistories[Number(index)].length;
    });
    return totalGuesses / totalGamesWon;
  }, [shareHistories, gameWins, totalGamesWon]);

  return {
    streak,
    maxStreak,
    totalGamesWon,
    totalGamesLost,
    totalGames: totalGamesLost + totalGamesWon,
    winRatio: totalGamesWon / (totalGamesWon + totalGamesLost),
    averageGuesses
  } as const;
}
