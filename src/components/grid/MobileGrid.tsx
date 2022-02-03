import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  solution: string;
  knownLetters?: (string | undefined)[];
  guesses: string[];
  currentGuess: string;
}

export const MobileGrid = ({ solution, knownLetters = [], guesses, currentGuess }: Props) => {
  const empties = Array.from(Array(6 - guesses.length));

  return (
    <div className="pb-3">
      <div className='grid grid-cols-2 my-3 max-w-screen'>
        {guesses.map((guess, i) => (
          <CompletedRow key={i} guess={guess} solution={solution} knownLetters={knownLetters} size='sm' />
        ))}
        {empties.map((_, i) => (
          <EmptyRow key={i} solution={solution} size='sm' />
        ))}
      </div>
      {guesses.length < 6 && <CurrentRow guess={currentGuess} solution={solution} knownLetters={knownLetters} />}
    </div>
  )
}
