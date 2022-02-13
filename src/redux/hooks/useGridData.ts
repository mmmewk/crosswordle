import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux"
import { GridData } from "../../types"
import { RootState } from "../store"
import { setGridData } from "../slices/crosswordSlice";
import { createGridData } from "../../lib/crossword-utils";
import crosswords from "../../constants/crosswords";

export const useGridData = (index: number) => {
  const dispatch = useDispatch();

  const updateGridData = useCallback((newGridData: GridData) => {
    dispatch(setGridData({ index, gridData: newGridData }));
  }, [dispatch, index]);

  const gridData = useSelector((state: RootState) => {
    const data = state.crossword.gridDatas[index];
    if (!data) {
      const initialGridData = createGridData(crosswords[index]);
      updateGridData(initialGridData);
      return initialGridData;
    }
    return data;
  });

  return [gridData, updateGridData] as const;
}
