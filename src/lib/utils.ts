import queryString from 'query-string';
import crosswords from "../constants/crosswords";
import padStart from 'lodash/padStart';
import { CrosswordInput, Direction, GridData, WordInput } from '../types';
import { Guesses } from '../redux/slices/wordleSlice';
import { get } from 'lodash';

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

export function getPuzzleOfTheDay() {
  const queryIndex = Number(queryString.parse(window.location.search)?.index as string);

  // January 20, 2022 Game Epoch
  const epochMs = +new Date('2022-01-20T00:00:00');
  const now = Date.now();
  const msInDay = 86400000
  let index = Math.floor((now - epochMs) / msInDay);
  index = Math.min(index, crosswords.length - 1);
  if (queryIndex >= 0) index = Math.min(index, queryIndex);

  return {
    crossword: crosswords[index],
    crosswordIndex: index,
  }
};

export const { crossword, crosswordIndex } = getPuzzleOfTheDay();

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
