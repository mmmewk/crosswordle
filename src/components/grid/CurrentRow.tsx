import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Cell } from './Cell'
import GraphemeSplitter from 'grapheme-splitter'

type Props = {
  guess: string;
  solution: string;
  focusedIndex: number;
}

export const CurrentRow : React.FC<Props> = ({ guess, solution, focusedIndex }) => {
  const { knownLetters, penciledLetters } = useSelector((state: RootState) => state.crossword);

  const splitter = new GraphemeSplitter()
  const splitGuess = splitter.splitGraphemes(guess)

  const emptyCells = Array.from(Array(solution.length - splitGuess.length));
  const guessLength = splitGuess.length;

  const getLetter = (index: number) => (
    splitGuess[index] || knownLetters[index] || penciledLetters[index]
  );

  if (solution.length - splitGuess.length < 0) return null;

  const getMode = (index: number) => {
    if (splitGuess[index]) return 'input';
    if (knownLetters[index]) return 'known';
    if (penciledLetters[index]) return 'pencil';
  };

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((_, i) => (
        <Cell key={i} value={getLetter(i)} mode={getMode(i)} isFocused={i === focusedIndex}/>
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} value={getLetter(i + guessLength)} mode={getMode(i + guessLength)} isFocused={(i + guessLength) === focusedIndex}/>
      ))}
    </div>
  )
}
