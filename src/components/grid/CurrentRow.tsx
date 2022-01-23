import { Cell } from './Cell'

type Props = {
  guess: string;
  solution: string;
}

export const CurrentRow : React.FC<Props> = ({ guess, solution }) => {
  const splitGuess = guess.split('')
  const emptyCells = Array.from(Array(solution.length - splitGuess.length))

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
