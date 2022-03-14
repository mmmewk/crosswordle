import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CellColors } from '../../components/mini-crossword/MiniCrossword';
import { CrosswordInput, Direction, UsedCellData } from "../../types";
import crosswords from '../../constants/crosswords';

export type Guesses = {
  [direction: string]: {
    [number: string]: string[];
  };
};

export interface WordleSlice {
  // All guesses made in a puzzle
  guesses: {
    [index: number]: Guesses;
  },
  // A historical record of your guess order to use in sharing
  shareHistories: {
    [index: number]: CellColors[];
  },
  // Whether a crosswordle game has been won or not
  gameWins: {
    [index: number]: boolean;
  },
  // The cell that can no longer be guessed, if game was lost
  lostCells: {
    [index: number]: UsedCellData;
  },
  // The time it took to solve each puzzle
  times: {
    [index: number]: number;
  }
};

const initialState: WordleSlice = {
  guesses: {},
  shareHistories: {},
  gameWins: {},
  lostCells: {},
  times: {},
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

export const wordleSlice = createSlice({
  name: 'wordle',
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
    startTimer: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload
      state.times[index] ||= 0;
    },
    incrementTimer: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload
      // Don't increment timer if it hasn't been started
      if (state.times[index] === undefined) return;
      // Don't increment timer if game is over
      if (state.gameWins[index] || state.lostCells[index]) return;
      state.times[index] += 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addGuess, pushShareHistory, setGameWon, setLostCell, startTimer, incrementTimer } = wordleSlice.actions;

export default wordleSlice.reducer;
