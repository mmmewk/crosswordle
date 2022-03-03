import get from "lodash/get";
import cloneDeep from 'lodash/cloneDeep';
import React, { useCallback, useEffect, useImperativeHandle } from "react";
import { useRefState } from "../../lib/hooks";
import { GridData, CellData, Direction, UsedCellData, WordInput } from "../../types"
import { createGridData, otherDirection } from "../../lib/crossword-utils";
import { useGridData } from "../../redux/hooks/useGridData";
import { crosswordIndex, crossword, getInitialClue } from "../../lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type Props = {
  guess?: string;
  onMoved?: (cell: CellData, direction: Direction, knownLetters: (string | undefined)[]) => void;
  onChange?: (gridData: GridData, knownLetters: (string | undefined)[]) => void;
};

type Handle = {
  moveTo: (row: number, col: number) => void,
  guessWord: (guess: string) => void,
  pencilLetter: (letter: string) => void,
  eraseLetter: () => void,
  reset: () => void,
}

const { initialClue: initialWord, initialDirection } = getInitialClue(crossword);

export const Crossword = React.forwardRef<Handle, Props>(({ onMoved, onChange, guess }, ref) => {
  const darkMode = useSelector((state: RootState) => state.settings.darkMode);
  const [gridData, setGridData] = useGridData(crosswordIndex);
  const [focusedCell, setFocusedCell, focusedCellRef] = useRefState<UsedCellData>(gridData[initialWord.row][initialWord.col] as UsedCellData);
  const [focusedDirection, setFocusedDirection, focusedDirectionRef] = useRefState<Direction>(initialDirection);

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
    const targetDirection = x !== 0 ? 'across' : 'down';
    const cellToSelect = targetDirection === focusedDirection ? newCell : oldCell;

    selectCell(cellToSelect.used ? cellToSelect : oldCell, targetDirection);
  }, [focusedCellRef, getCell, selectCell, focusedDirection]);

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
    const focusedClue = crossword[focusedDirection][number] as WordInput;

    if (!number || !focusedClue) return [];

    return Array.from(focusedClue.answer).map((_, index) => {
      let letterRow = focusedClue.row + (focusedDirection === 'across' ? 0 : index);
      let letterCol = focusedClue.col + (focusedDirection === 'across' ? index : 0);
      const cell = gridData[letterRow][letterCol];
      if (!cell.used) return undefined;

      return cell.guess;
    });
  }, [focusedCell, focusedDirection, gridData])

  useEffect(() => {
    if (onMoved) onMoved(focusedCell, focusedDirection, getKnownLetters());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedCell, focusedDirection, getKnownLetters]);

  useEffect(() => {
    if (onChange) onChange(gridData, getKnownLetters());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData, getKnownLetters]);

  useImperativeHandle(ref, () => ({
    guessWord: (guess: string) => {
      const focusedNumber = focusedCell[focusedDirection];

      if (!focusedNumber) return;
      const focusedWord = crossword[focusedDirection][focusedNumber];

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
    pencilLetter: (letter: string) => {
      const gridDataClone = cloneDeep(gridData);
      let { row, col } = focusedCell;
      gridDataClone[row][col].pencil = letter;
      setGridData(gridDataClone);
    },
    eraseLetter: () => {
      const gridDataClone = cloneDeep(gridData);
      let { row, col } = focusedCell;
      delete gridDataClone[row][col].pencil;
      setGridData(gridDataClone);
    },
    reset: () => {
      setGridData(createGridData(crossword));
    },
    moveTo: (row, col) => {
      const cell = getCell(row, col);

      if (!cell.used) return;
      selectCell(cell, focusedDirection);
    },
  }));

  const getGuessedLetter = (cell: CellData) => {
    if (!cell.used || !guess) return;

    const focusedNumber = focusedCell[focusedDirection];

    if (!focusedNumber || cell[focusedDirection] !== focusedNumber) return;
    const focusedWord = crossword[focusedDirection][focusedNumber];
    const letterIndex = cell.row - focusedWord.row || cell.col - focusedWord.col;
    return guess[letterIndex];
  };

  const numberColor = darkMode ? 'white' : 'rgba(0, 0, 0, 0.25)';
  const textColor = darkMode ? 'white' : 'black';
  const guessTextColor = darkMode ? '#f1c40f' : 'rgba(0, 0, 255, 0.6)';
  const pencilColor = darkMode ? 'rgba(170, 170, 170)' : 'rgba(107, 114, 128, 0.5)';
  const selectedCellColor = darkMode ? 'rgb(66, 99, 148)' : '#FFFF00';
  const selectedWordColor = darkMode ? 'rgb(54, 45, 103)' : 'rgb(255, 255, 204)';

  return (
    <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width='100%' height='100%'>
      <rect x={margin} y={margin} width={crosswordSize} height={crosswordSize} fill="black" />
      {gridData.flat().map((cell: CellData) => {
        if (!cell.used) return null;
        const key = `${cell.row}_${cell.col}`;

        let color = darkMode ? 'rgb(87, 88, 96)' : 'white';
        if (isCellSelected(cell)) {
          color = selectedCellColor;
        } else if (cell[focusedDirection] === focusedCell[focusedDirection]) {
          color = selectedWordColor;
        }

        const guessedLetter = getGuessedLetter(cell);
        let textFill = textColor;
        if (guessedLetter) textFill = guessTextColor;
        if (!guessedLetter && !cell.guess && cell.pencil) textFill = pencilColor;
        const letter = guessedLetter || cell.guess || cell.pencil;

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
                style={{ fontSize: '50%', fill: numberColor, userSelect: 'none' }}
              >{cell.number}</text>
            )}
            {letter && (
              <text
                x={(cell.col + 0.5) * squareSize + margin}
                y={(cell.row + 0.5) * squareSize + margin}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fill: textFill, userSelect: 'none', fontSize: '25px' }}
              >{letter}</text>
            )}
          </g>
        );
      })}
    </svg>
  )
});
