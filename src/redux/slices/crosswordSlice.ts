import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridData } from "../../types";
import { REHYDRATE } from 'redux-persist';

export interface CrosswordState {
  gridDatas: {
    [index: number]: GridData;
  };
  knownLetters: (string | undefined)[];
  penciledLetters: (string | undefined)[];
};

const initialState: CrosswordState = {
  gridDatas: {},
  knownLetters: [],
  penciledLetters: [],
}

export const crosswordSlice = createSlice({
  name: 'crossword',
  initialState,
  reducers: {
    setGridData: (state, action: PayloadAction<{ index: number, gridData: GridData }>) => {
      const { index, gridData } = action.payload;
      state.gridDatas[index] = gridData;
    },
    setKnownLetters: (state, action: PayloadAction<CrosswordState['knownLetters']>) => {
      state.knownLetters = (action.payload);
    },
    setPenciledLetters: (state, action: PayloadAction<CrosswordState['penciledLetters']>) => {
      state.penciledLetters = (action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: any) => {
      const gridDatas = action?.payload?.crossword?.gridDatas || {};
      return { ...state, gridDatas };
    });
  }
});

// Action creators are generated for each case reducer function
export const { setGridData, setPenciledLetters, setKnownLetters } = crosswordSlice.actions;

export default crosswordSlice.reducer;
