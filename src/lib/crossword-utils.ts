import type {
  CrosswordInput,
  Direction,
  GridData,
  UsedCellData,
} from '../types';
import { unicodeLength, unicodeSplit } from './words';

type RowOrCol = 'row' | 'col';

const directionInfo: Record<
  Direction,
  { primary: RowOrCol; orthogonal: RowOrCol }
> = {
  across: {
    primary: 'col',
    orthogonal: 'row',
  },
  down: {
    primary: 'row',
    orthogonal: 'col',
  },
};

export const bothDirections = Object.keys(directionInfo) as Direction[];

export function isAcross(direction: Direction) {
  return direction === 'across';
}

export function otherDirection(direction: Direction) {
  return isAcross(direction) ? 'down' : 'across';
}

export function calculateExtents(data: CrosswordInput, direction: Direction) {
  const dir = directionInfo[direction];
  let primaryMax = 0;
  let orthogonalMax = 0;

  Object.entries(data[direction]).forEach(([, info]) => {
    const primary = info[dir.primary] + unicodeLength(info.answer) - 1;

    if (primary > primaryMax) {
      primaryMax = primary;
    }

    const orthogonal = info[dir.orthogonal];
    if (orthogonal > orthogonalMax) {
      orthogonalMax = orthogonal;
    }
  });

  return {
    [dir.primary]: primaryMax,
    [dir.orthogonal]: orthogonalMax,
  };
}

export function createEmptyGrid(size: number) {
  const gridData: GridData = Array(size);

  for (let r = 0; r < size; r++) {
    gridData[r] = Array(size);
    for (let c = 0; c < size; c++) {
      gridData[r][c] = {
        row: r,
        col: c,
        used: false,
      };
    }
  }

  return gridData;
}

// Given the "nice format" for a crossword, generate the usable data optimized
// for rendering and our interactivity.
export function createGridData(data: CrosswordInput) {
  const acrossMax = calculateExtents(data, 'across');
  const downMax = calculateExtents(data, 'down');

  const size =
    Math.max(...Object.values(acrossMax), ...Object.values(downMax)) + 1;

  const gridData = createEmptyGrid(size);

  bothDirections.forEach((direction) => {
    Object.entries(data[direction]).forEach(([number, info]) => {
      const { row: rowStart, col: colStart, answer } = info;
      
        for (let i = 0; i < unicodeLength(answer); i++) {

        const row = rowStart + (direction === 'down' ? i : 0);
        const col = colStart + (direction === 'across' ? i : 0);
        const cellData = gridData[row][col] as UsedCellData;
        const splitAnswer = unicodeSplit(answer);
  
        cellData.used = true;
        cellData.answer = splitAnswer[i];
        cellData[direction] = number;
  
        if (i === 0) cellData.number = number;
      }
    });
  });

  if (data.circles) {
    data.circles.forEach(([row, col]) => {
      const cellData = gridData[row][col];
      if (!cellData.used) return;

      cellData.circle = true;
    });
  }

  return gridData;
}
