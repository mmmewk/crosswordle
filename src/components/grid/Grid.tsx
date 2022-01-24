import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  solution: string;
  knownLetters?: (string | undefined)[];
  guesses: string[];
  currentGuess: string;
}

export const Grid = ({ solution, knownLetters = [], guesses, currentGuess }: Props) => {
  const empties =
    guesses.length < 5 ? Array.from(Array(5 - guesses.length)) : [];

  return (
    <div className="pb-6">
      {guesses.map((guess, i) => (
        <CompletedRow key={i} guess={guess} solution={solution} knownLetters={knownLetters} />
      ))}
      {guesses.length < 6 && <CurrentRow guess={currentGuess} solution={solution} knownLetters={knownLetters} />}
      {empties.map((_, i) => (
        <EmptyRow key={i} solution={solution} />
      ))}
    </div>
  )
}
