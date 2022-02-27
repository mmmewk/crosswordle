import { Cell } from './Cell'

type Props = {
  guess: string;
  knownLetters: (string | undefined)[];
  solution: string;
  focusedIndex: number;
}

export const CurrentRow : React.FC<Props> = ({ guess, knownLetters, solution, focusedIndex }) => {
  if (solution.length - guess.length <= 0) return null;

  const splitGuess = guess.split('');
  const emptyCells = Array.from(Array(solution.length - splitGuess.length));
  const guessLength = splitGuess.length;

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} knownValue={knownLetters[i]} isFocused={i === focusedIndex}/>
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} knownValue={knownLetters[i + guessLength]} isFocused={(i + guessLength) === focusedIndex}/>
      ))}
    </div>
  )
}
