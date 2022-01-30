import { CellColors } from "../components/mini-crossword/MiniCrossword";

const gameStateKey = 'gameState';

export type StoredGameState = {
  crosswordIndex: number;
  guesses: {
    [direction: string]: {
      [number: string]: string[];
    };
  };
  shareHistory: CellColors[];
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)

  return state ? (JSON.parse(state) as StoredGameState) : null
}
