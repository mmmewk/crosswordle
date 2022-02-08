// TODO: Use redux persist
import { GridData } from "./types";

const gameStateKey = 'crosswordState';

export type StoredGameState = {
  crosswordIndex: number;
  gridData: GridData;
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

