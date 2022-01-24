const gameStateKey = 'gameState'

type StoredGameState = {
  crosswordIndex: number;
  guesses: { [word: string]: string[] };
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)

  return state ? (JSON.parse(state) as StoredGameState) : null
}
