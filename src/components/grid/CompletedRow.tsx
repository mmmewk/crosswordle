import { getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'

type Props = {
  solution: string;
  guess: string;
  size?: 'sm' | 'lg';
}

export const CompletedRow = ({ solution, guess, size = 'lg' }: Props) => {
  const statuses = getGuessStatuses(solution, guess)
  const splitGuess = unicodeSplit(guess)

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} status={statuses[i]} size={size} />
      ))}
    </div>
  )
}
