import crosswords from "../constants/crosswords";

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

export function getPuzzleOfTheDay() {
  // January 22, 2022 Game Epoch
  const epochMs = +new Date('2022-01-22T00:00:00');
  const now = Date.now();
  const msInDay = 86400000
  let index = Math.floor((now - epochMs) / msInDay);
  index = Math.min(index, crosswords.length - 1);
  index = 2;
  return {
    crossword: crosswords[index],
    crosswordIndex: index,
  }
};

export const { crossword, crosswordIndex } = getPuzzleOfTheDay();

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
