import { CrosswordInput, UsedCellData } from "../components/crossword/types";
import { CellColors } from "../components/mini-crossword/MiniCrossword";

const gameStateKey = 'gameState';

export type Guesses = {
  [direction: string]: {
    [number: string]: string[];
  };
};

export type StoredGameState = {
  crosswordIndex: number;
  guesses: Guesses;
  shareHistory: CellColors[];
  isGameWon: boolean;
  lostCell: UsedCellData | null;
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)

  return state ? (JSON.parse(state) as StoredGameState) : null
}

export const initialStateFromLocalStorage = <T>(
  { key, defaultValue, crosswordIndex }: 
  { key: keyof StoredGameState, defaultValue: T, crosswordIndex: number }
) => {
  return () => {
    const loaded = loadGameStateFromLocalStorage();
    if (!loaded || loaded.crosswordIndex !== crosswordIndex) return defaultValue;
    return loaded[key] as unknown as T;
  }
};

export const generateInitialGuessState = (data: CrosswordInput) => {
  return {
    across: Object.keys(data['across']).reduce((guessData, num) => {
      guessData[num] = [];
      return guessData;
    }, {} as Guesses[string]),
    down: Object.keys(data['down']).reduce((guessData, num) => {
      guessData[num] = [];
      return guessData;
    }, {} as Guesses[string]),
  }
};
