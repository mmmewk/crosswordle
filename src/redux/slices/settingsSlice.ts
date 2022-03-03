import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  darkMode: boolean,
  advancedKeyboard: boolean,
};

const initialState: SettingsState = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  advancedKeyboard: false,
}

export const settingsSlice = createSlice({
  name: 'crossword',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setAdvancedKeyboard: (state, action: PayloadAction<boolean>) => {
      state.advancedKeyboard = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleDarkMode, setAdvancedKeyboard } = settingsSlice.actions;

export default settingsSlice.reducer;
