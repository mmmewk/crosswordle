import queryString from 'query-string';
import crosswords from "../constants/crosswords";
import padStart from 'lodash/padStart';
import { CrosswordInput, Direction, GridData, WordInput } from '../types';
import { Guesses } from '../redux/slices/wordleSlice';
import get from 'lodash/get';
import addDays from 'date-fns/addDays';
import differenceInDays from 'date-fns/differenceInDays';

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

const puzzleStartDate = new Date('2022-01-20T00:00:00');

export function getPuzzleIndexForDate(date: Date) {
  return differenceInDays(date, puzzleStartDate);
}

export function dateFromPuzzleIndex(index: number) {
  return addDays(puzzleStartDate, index);
}

export function getTodaysPuzzleIndex() {
  const index = getPuzzleIndexForDate(new Date());
  // Ensure we don't navigate to a puzzle that doesn't exist
  return Math.min(index, crosswords.length - 1);
}

export function getPuzzleOfTheDay() {
  let index = getTodaysPuzzleIndex();
  const queryIndex = Number(queryString.parse(window.location.search)?.index as string);
  if (queryIndex >= 0) index = Math.min(index, queryIndex);

  return {
    crossword: crosswords[index],
    crosswordIndex: index,
  }
};

export const { crossword, crosswordIndex } = getPuzzleOfTheDay();
export const todaysPuzzleIndex = getTodaysPuzzleIndex();

export function getInitialClue(crossword: CrosswordInput) {
  let initialClue = get(crossword, 'across.1') as WordInput;
  const initialDirection = initialClue ? 'across' : 'down' as Direction;
  if (!initialClue) initialClue = get(crossword, 'down.1');
  return { initialClue, initialDirection };
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const padTime = (time: number) => padStart(time.toString(), 2, '0');

export function timeTillTomorrow() {
  const now = new Date();
  const hours = 23 - now.getHours();
  const minutes = 59 - now.getMinutes();
  const seconds = 59 - now.getSeconds();
  return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
};

export function getTotalGuesses(guesses: Guesses) {
  const acrossGuesses = Object.values(guesses['across']).flat().length;
  const downGuesses = Object.values(guesses['down']).flat().length;
  return acrossGuesses + downGuesses;
}

export function gameProgress(gridData: GridData) {
  let totalCells = 0;
  let completedCells = 0;

  gridData.forEach((row) => {
    row.forEach((cell) => {
      if (!cell.used) return;
      totalCells += 1;
      if (cell.guess === cell.answer) completedCells += 1;
    });
  });

  return completedCells / totalCells;
};

export function dateString(date: Date) {
  return date.toISOString().split('T')[0]
}

export function formatTime(time?: number) {
  if (!time) return '0:00'
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${padStart(seconds.toString(), 2, '0')}`;
}
