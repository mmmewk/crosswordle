import { getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'

type Props = {
  solution: string;
  knownLetters: (string | undefined)[];
  guess: string;
  size?: 'sm' | 'lg';
}

export const CompletedRow = ({ solution, knownLetters, guess, size = 'lg' }: Props) => {
  const statuses = getGuessStatuses(solution, guess);

  return (
    <div className="flex justify-center mb-1">
      {guess.split('').map((letter, i) => (
        <Cell key={i} value={letter} status={statuses[i]} knownValue={knownLetters[i]} size={size} />
      ))}
    </div>
  )
}
