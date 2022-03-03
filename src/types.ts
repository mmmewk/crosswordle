export type Direction = 'across' | 'down';
export type GridPosition = {
  /** The 0-indexed row for the position. */
  row: number;
  /** The 0-indexed column for the position. */
  col: number;
}

/**
 * answer for a single across or down word.
 */
export type WordInput = {
  /** The answer for the clue */
  answer: string;
  /** The 0-based row on which the answer begins */
  row: number;
  /** The 0-based column on which the answer begins */
  col: number;
};

/**
 * The (original) input-format for clues and answers.  Note that while the
 * keys/properties under 'across' and 'down' are canonically the clue/answer
 * numbers, they can be *any* string value
 */
export type CrosswordInput = Record<Direction, Record<string, WordInput>> & {
  author?: string;
};

/**
 * The data stored/returned for a specific cell/position in the crossword.
 */
export type UsedCellData = GridPosition & {
    /** Whether the position/cell is used at all. */
    used: true;
    /** If present, a display "number" label for the cell */
    number?: string;
    /** The correct answer value for *only* this cell (a single letter) */
    answer: string;
    /** The user's guess value for *only* this cell (a single letter) */
    guess?: string;
    /** If present, the clue-number key for the "across" for this cell */
    across?: string;
    /** If present, the clue-number key for the "down" for this cell */
    down?: string;
    /** If present, the penciled in letter that the user input */
    pencil?: string;
};

/**
 * The data stored/returned for a specific unused or out-of-bounds cell/position
 * in the crossword.
 */
export type UnusedCellData = GridPosition & {
    /** Whether the position/cell is used at all. */
    used: false;
    /** Whether the position/cell is completely out-of-bounds */
    outOfBounds?: boolean;
    /** If present, the penciled in letter that the user input */
    pencil?: string;
};
/**
 * The data stored/returned for a specific cell/position in the crossword.
 */
export type CellData = UsedCellData | UnusedCellData;
export type GridData = CellData[][];
