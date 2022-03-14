import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Direction, UsedCellData } from "../../types"
import { RootState } from "../store"
import { addGuess as addGuessAction, pushShareHistory as pushShareHistoryAction, setGameWon, generateInitialGuessState, setLostCell } from "../slices/wordleSlice";
import { CellColors } from "../../components/mini-crossword/MiniCrossword";
import crosswords from "../../constants/crosswords";

export const useGameState = (index: number) => {
  const guesses = useSelector((state: RootState) => state.wordle.guesses[index] || generateInitialGuessState(crosswords[index]));
  const shareHistory = useSelector((state: RootState) => state.wordle.shareHistories[index] || []);
  const isGameWon = useSelector((state: RootState) => state.wordle.gameWins[index] || false);
  const lostCell = useSelector((state: RootState) => state.wordle.lostCells[index] as UsedCellData | undefined);
  const time = useSelector((state: RootState) => state.wordle.times[index] as number | undefined);
  const dispatch = useDispatch();

  const addGuess = useCallback((direction: Direction, number: string, guess: string) => {
    dispatch(addGuessAction({ index, direction, number, guess }));
  }, [dispatch, index]);

  const pushShareHistory = useCallback((cellColors: CellColors) => {
    dispatch(pushShareHistoryAction({ index, cellColors }));
  }, [dispatch, index]);

  const win = useCallback(() => {
    dispatch(setGameWon({ index }));
  }, [dispatch, index]);

  const lose = useCallback((lostCell: UsedCellData) => {
    dispatch(setLostCell({ index, lostCell }));
  }, [dispatch, index]);

  return { guesses, addGuess, shareHistory, pushShareHistory, isGameWon, win, lostCell, lose, time };
}
