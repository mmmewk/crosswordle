import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  solution: string;
  guesses: string[];
  currentGuess: string;
  focusedIndex: number;
}

export const MobileGrid = ({ solution, guesses, currentGuess, focusedIndex }: Props) => {
  const firstHalf = guesses.slice(0, 3);
  const firstHalfEmpties = Array.from(Array(3 - firstHalf.length));
  const secondHalf = guesses.slice(3, 6);
  const secondHalfEmpties = Array.from(Array(3 - secondHalf.length));

  return (
    <div className="pb-3">
      <div className='flex my-2 w-full'>
        <div className='w-1/2'>
          {firstHalf.map((guess, i) => (
            <CompletedRow key={i} guess={guess} solution={solution} size='sm' />
          ))}
          {firstHalfEmpties.map((_, i) => (
            <EmptyRow key={i} solution={solution} size='sm' />
          ))}
        </div>
        <div className='w-1/2'>
          {secondHalf.map((guess, i) => (
            <CompletedRow key={i} guess={guess} solution={solution} size='sm' />
          ))}
          {secondHalfEmpties.map((_, i) => (
            <EmptyRow key={i} solution={solution} size='sm' />
          ))}
        </div>
      </div>
      <CurrentRow guess={currentGuess} solution={solution} focusedIndex={focusedIndex} />
    </div>
  )
}
