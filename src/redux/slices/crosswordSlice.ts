import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridData } from "../../types";

export interface CrosswordState {
  gridDatas: {
    [index: number]: GridData;
  }
};

const initialState: CrosswordState = {
  gridDatas: {},
}

export const crosswordSlice = createSlice({
  name: 'crossword',
  initialState,
  reducers: {
    setGridData: (state, action: PayloadAction<{ index: number, gridData: GridData }>) => {
      const { index, gridData } = action.payload;
      state.gridDatas[index] = gridData;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGridData } = crosswordSlice.actions;

export default crosswordSlice.reducer;
