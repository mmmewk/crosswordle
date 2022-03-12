import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NavigationState {
  openModal?: 'about' | 'help' | 'helpKeyboardOnly' | 'settings' | 'share' | 'submit' | 'stats' | 'filters',
  firstRender: boolean;
};

const initialState: NavigationState = {
  openModal: undefined,
  firstRender: true,
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    hideModal: (state) => {
      state.openModal = undefined;
    },
    setOpenModal: (state, action: PayloadAction<NavigationState['openModal']>) => {
      state.openModal = action.payload;
    },
    markFirstRender: (state) => {
      state.firstRender = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOpenModal, hideModal, markFirstRender } = navigationSlice.actions;

export default navigationSlice.reducer;
