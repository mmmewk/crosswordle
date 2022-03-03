import { useWindowHeight } from '@react-hook/window-size/throttled';
import { useMediaBreakpoints } from '../../lib/hooks';
import { CompletedRow } from './CompletedRow';
import { CurrentRow } from './CurrentRow';
import { EmptyRow } from './EmptyRow';
import { MobileGrid } from './MobileGrid';

type Props = {
  solution: string;
  guesses: string[];
  currentGuess: string;
  focusedIndex: number;
}

export const Grid = ({ solution, guesses, currentGuess, focusedIndex }: Props) => {
  const isMobile = useMediaBreakpoints('md', 'down');
  const height = useWindowHeight();

  if (isMobile || height < 600) return <MobileGrid {...{ solution, guesses, currentGuess, focusedIndex }} />;

  const empties =
    guesses.length < 5 ? Array.from(Array(5 - guesses.length)) : [];

  return (
    <div className="pb-6">
      {guesses.map((guess, i) => (
        <CompletedRow key={i} guess={guess} solution={solution} />
      ))}
      {guesses.length < 6 && (
        <CurrentRow guess={currentGuess} solution={solution} focusedIndex={focusedIndex} />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} solution={solution} />
      ))}
    </div>
  )
}
