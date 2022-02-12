import { cloneDeep, get } from "lodash";
import React, { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useRefState } from "../../lib/hooks";
import { GridData, CellData, CrosswordInput, Direction, UsedCellData, WordInput } from "./types"
import { createGridData, otherDirection } from "./utils";
import {
  initialStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from './localStorage';

const SELECTED_CELL_COLOR = '#FFFF00';
const SELECTED_WORD_COLOR = 'rgb(255,255,204)';

type Props = {
  data: CrosswordInput;
  crosswordIndex: number;
  onMoved?: (cell: CellData, direction: Direction, knownLetters: (string | undefined)[]) => void;
  onChange?: (gridData: GridData, knownLetters: (string | undefined)[]) => void;
};

type Handle = {
  guessWord: (guess: string) => void,
  reset: () => void,
}

export const Crossword = React.forwardRef<Handle, Props>(({ data, onMoved, onChange, crosswordIndex }, ref) => {
  const initialWord = get(data, 'across.1', get(data, 'down.1')) as WordInput;

  const [gridData, setGridData] = useState<GridData>(
    initialStateFromLocalStorage<GridData>({ key: 'gridData', defaultValue: createGridData(data), crosswordIndex })
  );
  const [focusedCell, setFocusedCell, focusedCellRef] = useRefState<UsedCellData>(gridData[initialWord.row][initialWord.col] as UsedCellData);
  const [focusedDirection, setFocusedDirection, focusedDirectionRef] = useRefState<Direction>('across');

  const svgSize = 240;
  const margin = 20;
  const crosswordSize = svgSize - 2 * margin;
  const squareSize = crosswordSize / gridData.length;
  const borderSize = 0.125;
  const numberOffset = 0.5;

  const selectCell = useCallback((cell: UsedCellData, targetDirection: Direction) => {
    const actualDirection = cell[targetDirection] ? targetDirection : otherDirection(targetDirection);

    setFocusedDirection(actualDirection);
    setFocusedCell(cell)
  }, [setFocusedCell, setFocusedDirection]);

  const isCellSelected = useCallback((cell: CellData) => cell.used && cell.row === focusedCell.row && cell.col === focusedCell.col, [focusedCell]);
  const getCell = useCallback((row: number, col: number) => get(gridData, `${row}.${col}`, { used: false }) as CellData, [gridData]);

  const onClick = useCallback((cell: CellData) => {
    if (!cell.used) return;

    const targetDirection = isCellSelected(cell) ? otherDirection(focusedDirection) : focusedDirection;
    selectCell(cell, targetDirection);
  }, [focusedDirection, selectCell, isCellSelected]);

  const moveRelative = useCallback((x: number, y: number) => {
    const oldCell = focusedCellRef.current;
    const newCell = getCell(oldCell.row + y, oldCell.col + x);
    if (!newCell.used) return;

    const targetDirection = x !== 0 ? 'across' : 'down';
    
    selectCell(newCell, targetDirection)
  }, [focusedCellRef, getCell, selectCell]);

  const switchDirections = useCallback(() => {
    const targetDirection = otherDirection(focusedDirectionRef.current);
    const targetCell = focusedCellRef.current;

    selectCell(targetCell, targetDirection);
  }, [focusedCellRef, focusedDirectionRef, selectCell]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') {
        moveRelative(-1, 0);
      } else if (e.code === 'ArrowRight') {
        moveRelative(1, 0);
      } else if (e.code === 'ArrowDown') {
        moveRelative(0, 1);
      } else if (e.code === 'ArrowUp') {
        moveRelative(0, -1);
      } else if (e.code === 'Tab') {
        switchDirections();
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [moveRelative, switchDirections]);

  const getKnownLetters = useCallback(() => {
    const number = focusedCell[focusedDirection] as string;
    const focusedClue = data[focusedDirection][number] as WordInput;
    return Array.from(focusedClue.answer).map((_, index) => {
      let letterRow = focusedClue.row + (focusedDirection === 'across' ? 0 : index);
      let letterCol = focusedClue.col + (focusedDirection === 'across' ? index : 0);
      const cell = gridData[letterRow][letterCol];
      if (!cell.used) return undefined;

      return cell.guess;
    });
  }, [focusedCell, focusedDirection, gridData, data])

  useEffect(() => {
    if (onMoved) onMoved(focusedCell, focusedDirection, getKnownLetters());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedCell, focusedDirection]);

  useEffect(() => {
    if (onChange) onChange(gridData, getKnownLetters());
    saveGameStateToLocalStorage({ gridData, crosswordIndex });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData, crosswordIndex]);

  useImperativeHandle(ref, () => ({
    guessWord: (guess: string) => {
      const focusedNumber = focusedCell[focusedDirection];

      if (!focusedNumber) return;
      const focusedWord = data[focusedDirection][focusedNumber];

      const gridDataClone = cloneDeep(gridData);

      let { row, col, answer } = focusedWord;
      Array.from(guess).forEach((letter, index) => {
        const newRow = row + (focusedDirection === 'down' ? index : 0);
        const newCol = col + (focusedDirection === 'across' ? index : 0);
        const cellClone = gridDataClone[newRow][newCol];
        if (!cellClone.used) return;
        if (letter === answer[index]) cellClone.guess = letter;
      });

      setGridData(gridDataClone);
    },
    reset: () => {
      setGridData(createGridData(data));
    },
  }));

  return (
    <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width='100%' height='100%'>
      <rect x={margin} y={margin} width={crosswordSize} height={crosswordSize} fill="black" />
      {gridData.flat().map((cell: CellData) => {
        if (!cell.used) return null;
        const key = `${cell.row}_${cell.col}`;

        let color = 'white';
        if (isCellSelected(cell)) {
          color = SELECTED_CELL_COLOR;
        } else if (cell[focusedDirection] === focusedCell[focusedDirection]) {
          color = SELECTED_WORD_COLOR;
        }

        return (
          <g key={key} onClick={() => onClick(cell)}>
            <rect
              x={cell.col * squareSize + borderSize + margin}
              y={cell.row * squareSize + borderSize + margin}
              width={squareSize - 2 * borderSize}
              height={squareSize - 2 * borderSize}
              fill={color}
              stroke='black'
              strokeWidth={0.4}
            />
            {cell.number && (
              <text
                x={cell.col * squareSize + numberOffset + margin}
                y={cell.row * squareSize + numberOffset + margin}
                textAnchor="start"
                dominantBaseline="hanging"
                style={{ fontSize: '50%', fill: 'rgba(0, 0, 0, 0.25)', userSelect: 'none' }}
              >{cell.number}</text>
            )}
            {cell.guess && (
              <text
                x={(cell.col + 0.5) * squareSize + margin}
                y={(cell.row + 0.5) * squareSize + margin}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fill: 'rgba(0, 0, 0)', userSelect: 'none', fontSize: '25px' }}
              >{cell.guess}</text>
            )}
          </g>
        );
      })}
    </svg>
  )
});
