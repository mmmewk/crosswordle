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
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setAdvancedKeyboard: (state, action: PayloadAction<boolean>) => {
      state.advancedKeyboard = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDarkMode, setAdvancedKeyboard } = settingsSlice.actions;

export default settingsSlice.reducer;
