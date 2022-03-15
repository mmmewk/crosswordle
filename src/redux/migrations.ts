import { endOfToday, endOfYesterday } from "date-fns";
import { getTodaysPuzzleIndex } from "../lib/utils";
import { RootState } from "./store";

const initialState : Partial<RootState> = {
  crossword: {
    gridDatas: {},
    knownLetters: [],
    penciledLetters: [],
  },
  wordle: {
    guesses: {},
    shareHistories: {},
    gameWins: {},
    lostCells: {},
    times: {},
  },
  settings: {
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    pencilMode: false,
    advancedKeyboard: false,
    showTimer: false,
    highContrastMode: false,
  },
  stats: {
    streak: 0,
    maxStreak: 0,
    lastDailyWin: undefined,
  },
};

export const migrations : any = {
  0: (state: RootState) => {
    return {
      ...state,
      stats: {
        streak: backfillStreak(state),
        maxStreak: backfillMaxStreak(state),
        lastDailyWin: backfillLastDailyWin(state),
      }
    }
  },
  1: (state: RootState) => {
    return {
      ...state,
      wordle: {
        ...state.wordle,
        times: {},
      }
    }
  },
  // Enusre that state is initialized for everyone
  2: (state: RootState) => {
    return {
      ...state,
      crossword: {
        ...initialState.crossword,
        ...state.crossword,
      },
      wordle: {
        ...initialState.wordle,
        ...state.wordle,
      },
      settings: {
        ...initialState.settings,
        ...state.settings,
      },
      stats: {
        ...initialState.stats,
        ...state.stats,
      },
    }
  },
  3: (state: RootState) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        highContrastMode: false,
      }
    }
  }
}

function backfillStreak(state: RootState) {
  if (!state.wordle) return;

  let crosswordIndex = getTodaysPuzzleIndex();
  let streak = 0;

  if (state.wordle.gameWins[crosswordIndex]) streak += 1;

  crosswordIndex -= 1;
  while (state.wordle.gameWins[crosswordIndex]) {
    streak += 1;
    crosswordIndex -= 1;
  }

  return streak;
};

function backfillMaxStreak(state: RootState) {
  if (!state.wordle) return;

  let crosswordIndex = getTodaysPuzzleIndex();
  let streak = 0;
  let maxStreak = 0;

  while (crosswordIndex > -1) {
    if (state.wordle.gameWins[crosswordIndex]) {
      streak += 1;
      maxStreak = Math.max(streak, maxStreak);
    } else {
      streak = 0;
    }
    crosswordIndex -= 1;
  }

  return maxStreak;
};

// Only care about today and yesterday, since its just used to track streak
function backfillLastDailyWin(state: RootState) {
  if (!state.wordle) return;

  const crosswordIndex = getTodaysPuzzleIndex();

  if (state.wordle.gameWins[crosswordIndex]) return +endOfToday();
  if (state.wordle.gameWins[crosswordIndex - 1]) return +endOfYesterday();
};
