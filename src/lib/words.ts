import { VALIDGUESSES } from '../constants/validGuesses'

export const isWordInWordList = (word: string) => {
  return VALIDGUESSES.includes(word.toLowerCase());
}
