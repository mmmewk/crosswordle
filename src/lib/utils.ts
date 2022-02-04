import queryString from 'query-string';
import crosswords from "../constants/crosswords";
import padStart from 'lodash/padStart';

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

export function getPuzzleOfTheDay() {
  const queryIndex = Number(queryString.parse(window.location.search)?.index as string);

  // January 21, 2022 Game Epoch
  const epochMs = +new Date('2022-01-21T00:00:00');
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
