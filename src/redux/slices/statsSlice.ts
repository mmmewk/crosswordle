import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { todaysPuzzleIndex } from '../../lib/utils';
import startOfYesterday from'date-fns/startOfYesterday';
import isBefore from 'date-fns/isBefore';

export interface StatsState {
  maxStreak: number;
  streak: number;
  lastDailyWin?: number;
};

const initialState: StatsState = {
  maxStreak: 0,
  streak: 0,
  lastDailyWin: undefined,
}

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateStreakWithWin: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index !== todaysPuzzleIndex) return;

      if (!state.lastDailyWin || isBefore(state.lastDailyWin, startOfYesterday())) {
        state.streak = 1
      } else {
        state.streak += 1
      }

      if (state.streak > state.maxStreak) state.maxStreak = state.streak;
      state.lastDailyWin = +new Date();
    },
    updateStreakWithLoss: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index !== todaysPuzzleIndex) return;

      state.streak = 0;
      state.lastDailyWin = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateStreakWithWin, updateStreakWithLoss } = statsSlice.actions;

export default statsSlice.reducer;
