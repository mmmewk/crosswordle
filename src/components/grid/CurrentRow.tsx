import { Cell } from './Cell'

type Props = {
  guess: string;
  knownLetters: (string | undefined)[];
  solution: string;
}

export const CurrentRow : React.FC<Props> = ({ guess, knownLetters, solution }) => {
  const splitGuess = guess.split('');
  const emptyCells = Array.from(Array(solution.length - splitGuess.length));
  const guessLength = splitGuess.length;

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} knownValue={knownLetters[i]}/>
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} knownValue={knownLetters[i + guessLength]}/>
      ))}
    </div>
  )
}
