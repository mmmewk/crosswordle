import { getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'

type Props = {
  solution: string;
  guess: string;
}

export const CompletedRow = ({ solution, guess }: Props) => {
  const statuses = getGuessStatuses(solution, guess);

  return (
    <div className="flex justify-center mb-1">
      {guess.split('').map((letter, i) => (
        <Cell key={i} value={letter} status={statuses[i]} />
      ))}
    </div>
  )
}
