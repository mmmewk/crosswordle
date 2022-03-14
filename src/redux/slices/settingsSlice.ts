import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  darkMode: boolean,
  advancedKeyboard: boolean,
  pencilMode: boolean,
  showTimer: boolean,
};

const initialState: SettingsState = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  pencilMode: false,
  advancedKeyboard: false,
  showTimer: false,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setPencilMode: (state, action: PayloadAction<boolean>) => {
      state.pencilMode = action.payload;
    },
    setAdvancedKeyboard: (state, action: PayloadAction<boolean>) => {
      state.advancedKeyboard = action.payload;
    },
    setShowTimer: (state, action: PayloadAction<boolean>) => {
      state.showTimer = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDarkMode, setAdvancedKeyboard, setPencilMode, setShowTimer } = settingsSlice.actions;

export default settingsSlice.reducer;
