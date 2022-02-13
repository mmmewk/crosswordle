import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CellColors } from '../../components/mini-crossword/MiniCrossword';
import { CrosswordInput, Direction, UsedCellData } from "../../types";
import crosswords from '../../constants/crosswords';

export type Guesses = {
  [direction: string]: {
    [number: string]: string[];
  };
};

export type GameState = {
  guesses: Guesses;
  shareHistory: CellColors[];
  isGameWon: boolean;
  lostCell: UsedCellData | null;
}

export interface WordleSlice {
  guesses: {
    [index: number]: Guesses;
  },
  shareHistories: {
    [index: number]: CellColors[];
  },
  gameWins: {
    [index: number]: boolean;
  },
  lostCells: {
    [index: number]: UsedCellData;
  },
};

const initialState: WordleSlice = {
  guesses: {},
  shareHistories: {},
  gameWins: {},
  lostCells: {},
}

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

export const crosswordSlice = createSlice({
  name: 'crossword',
  initialState,
  reducers: {
    addGuess: (state, action: PayloadAction<{ index: number, direction: Direction, number: string, guess: string }>) => {
      const { index, direction, number, guess } = action.payload;
      state.guesses[index] ||= generateInitialGuessState(crosswords[index]);
      state.guesses[index][direction][number].push(guess);
    },
    pushShareHistory: (state, action: PayloadAction<{ index: number, cellColors: CellColors }>) => {
      const { index, cellColors } = action.payload;
      state.shareHistories[index] ||= [];
      state.shareHistories[index].push(cellColors);
    },
    setGameWon: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      state.gameWins[index] = true;
    },
    setLostCell: (state, action: PayloadAction<{ index: number, lostCell: UsedCellData }>) => {
      const { index, lostCell } = action.payload;
      state.lostCells[index] = lostCell;
    },
    resetState: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      state.guesses[index] = generateInitialGuessState(crosswords[index]);
      state.shareHistories[index] = []
      delete state.gameWins[index];
      delete state.lostCells[index];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addGuess, pushShareHistory, setGameWon, setLostCell } = crosswordSlice.actions;

export default crosswordSlice.reducer;
