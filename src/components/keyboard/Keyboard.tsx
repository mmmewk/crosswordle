import { useEffect } from 'react'
import { KeyValue } from '../../lib/keyboard'
import { getStatuses } from '../../lib/statuses'
import { Key } from './Key'
import { BackspaceIcon } from '@heroicons/react/outline';

type Props = {
  solution: string;
  crossedSolution: string | undefined;
  knownChars?: string[];
  onChar: (value: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  guesses: string[];
  crossedGuesses: string[];
  index: number;
  crossedIndex?: number;
}

export const Keyboard = ({ solution, crossedSolution, knownChars, onChar, onDelete, onEnter, guesses, crossedGuesses, index, crossedIndex }: Props) => {
  const charStatuses = getStatuses(solution, guesses);
  const crossedCharStatus = crossedSolution ? getStatuses(crossedSolution, crossedGuesses) : {};

  // Update all known letters in the word to green
  knownChars?.forEach((letter) => {
    charStatuses[letter] = 'correct';
  });

  // Update all incorrect letters at the selected position to be partially gray
  // TODO: Update crossedCharStatus to be an array of letters that should be partially grayed
  // TODO: Given solution "bends" and guess "seedy" mark all e's except the 2nd index as partially gray
  guesses.forEach((guess) => {
    if (guess[index] !== solution[index]) crossedCharStatus[guess[index]] = 'absent';
  });
  crossedGuesses.forEach((guess) => {
    if (crossedIndex === undefined || !crossedSolution) return;

    if (guess[crossedIndex] !== crossedSolution[crossedIndex]) crossedCharStatus[guess[crossedIndex]] = 'absent';
  });

  const onClick = (value: KeyValue) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'DELETE') {
      onDelete()
    } else {
      onChar(value)
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else {
        const key = e.key.toUpperCase()
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
          onChar(key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar])

  return (
    <div className='mt-auto md:mt-none mb-3'>
      <div className="flex justify-center mb-1">
        <Key value="Q" onClick={onClick} status={charStatuses['Q']} crossedStatus={crossedCharStatus['Q']} />
        <Key value="W" onClick={onClick} status={charStatuses['W']} crossedStatus={crossedCharStatus['W']} />
        <Key value="E" onClick={onClick} status={charStatuses['E']} crossedStatus={crossedCharStatus['E']} />
        <Key value="R" onClick={onClick} status={charStatuses['R']} crossedStatus={crossedCharStatus['R']} />
        <Key value="T" onClick={onClick} status={charStatuses['T']} crossedStatus={crossedCharStatus['T']} />
        <Key value="Y" onClick={onClick} status={charStatuses['Y']} crossedStatus={crossedCharStatus['Y']} />
        <Key value="U" onClick={onClick} status={charStatuses['U']} crossedStatus={crossedCharStatus['U']} />
        <Key value="I" onClick={onClick} status={charStatuses['I']} crossedStatus={crossedCharStatus['I']} />
        <Key value="O" onClick={onClick} status={charStatuses['O']} crossedStatus={crossedCharStatus['O']} />
        <Key value="P" onClick={onClick} status={charStatuses['P']} crossedStatus={crossedCharStatus['P']} />
      </div>
      <div className="flex justify-center mb-1">
        <Key value="A" onClick={onClick} status={charStatuses['A']} crossedStatus={crossedCharStatus['A']} />
        <Key value="S" onClick={onClick} status={charStatuses['S']} crossedStatus={crossedCharStatus['S']} />
        <Key value="D" onClick={onClick} status={charStatuses['D']} crossedStatus={crossedCharStatus['D']} />
        <Key value="F" onClick={onClick} status={charStatuses['F']} crossedStatus={crossedCharStatus['F']} />
        <Key value="G" onClick={onClick} status={charStatuses['G']} crossedStatus={crossedCharStatus['G']} />
        <Key value="H" onClick={onClick} status={charStatuses['H']} crossedStatus={crossedCharStatus['H']} />
        <Key value="J" onClick={onClick} status={charStatuses['J']} crossedStatus={crossedCharStatus['J']} />
        <Key value="K" onClick={onClick} status={charStatuses['K']} crossedStatus={crossedCharStatus['K']} />
        <Key value="L" onClick={onClick} status={charStatuses['L']} crossedStatus={crossedCharStatus['L']} />
      </div>
      <div className="flex justify-center">
        <Key size='lg' value="ENTER" onClick={onClick}>
          Enter
        </Key>
        <Key value="Z" onClick={onClick} status={charStatuses['Z']} crossedStatus={crossedCharStatus['Z']} />
        <Key value="X" onClick={onClick} status={charStatuses['X']} crossedStatus={crossedCharStatus['X']} />
        <Key value="C" onClick={onClick} status={charStatuses['C']} crossedStatus={crossedCharStatus['C']} />
        <Key value="V" onClick={onClick} status={charStatuses['V']} crossedStatus={crossedCharStatus['V']} />
        <Key value="B" onClick={onClick} status={charStatuses['B']} crossedStatus={crossedCharStatus['B']} />
        <Key value="N" onClick={onClick} status={charStatuses['N']} crossedStatus={crossedCharStatus['N']} />
        <Key value="M" onClick={onClick} status={charStatuses['M']} crossedStatus={crossedCharStatus['M']} />
        <Key size='lg' value="DELETE" onClick={onClick}>
          <BackspaceIcon width={25} height={25} />
        </Key>
      </div>
    </div>
  )
}
