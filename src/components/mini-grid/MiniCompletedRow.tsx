import { getGuessStatuses } from '../../lib/statuses'
import { MiniCell } from './MiniCell'

type Props = {
  solution: string; 
  guess: string;
}

export const MiniCompletedRow = ({ solution, guess }: Props) => {
  const statuses = getGuessStatuses(solution, guess);

  return (
    <div className="flex justify-center mb-1">
      {guess.split('').map((letter, i) => (
        <MiniCell key={i} status={statuses[i]} />
      ))}
    </div>
  )
}
