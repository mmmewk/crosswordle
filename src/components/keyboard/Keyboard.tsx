import { useEffect } from 'react'
import { KeyValue } from '../../lib/keyboard'
import { CharStatus, getStatuses } from '../../lib/statuses'
import { Key } from './Key'
import { BackspaceIcon } from '@heroicons/react/outline';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

type Props = {
  solution: string;
  crossedSolution: string | undefined;
  onChar: (value: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  guesses: string[];
  crossedGuesses: string[];
  index: number;
  crossedIndex?: number;
}

export const Keyboard = ({ solution, crossedSolution, onChar, onDelete, onEnter, guesses, crossedGuesses, index, crossedIndex }: Props) => {
  const advancedKeyboard = useSelector((state: RootState) => state.settings.advancedKeyboard);
  const knownLetters = useSelector((state: RootState) => state.crossword.knownLetters);
  const charStatuses = getStatuses(solution, guesses);
  let crossedCharStatus : { [key: string]: CharStatus | undefined } = {};

  // Update all known letters in the word to green
  knownLetters.forEach((letter) => {
    if (letter) charStatuses[letter] = 'correct';
  });

  if (advancedKeyboard) {
    crossedCharStatus = crossedSolution ? getStatuses(crossedSolution, crossedGuesses) : {};

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
  }

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
        <Key value="்" onClick={onClick} status={charStatuses['்']} crossedStatus={crossedCharStatus['்']} />
        <Key value="ா" onClick={onClick} status={charStatuses['ா']} crossedStatus={crossedCharStatus['ா']} />
        <Key value="ி" onClick={onClick} status={charStatuses['ி']} crossedStatus={crossedCharStatus['ி']} />
        <Key value="ீ" onClick={onClick} status={charStatuses['ீ']} crossedStatus={crossedCharStatus['ீ']} />
        <Key value="ு" onClick={onClick} status={charStatuses['ு']} crossedStatus={crossedCharStatus['ு']} />
        <Key value="ூ" onClick={onClick} status={charStatuses['ூ']} crossedStatus={crossedCharStatus['ூ']} /> 
        <Key value="ெ" onClick={onClick} status={charStatuses['ெ']} crossedStatus={crossedCharStatus['ெ']} />
        <Key value="ே" onClick={onClick} status={charStatuses['ே']} crossedStatus={crossedCharStatus['ே']} />
        <Key value="ை" onClick={onClick} status={charStatuses['ை']} crossedStatus={crossedCharStatus['ை']} />
        <Key value="ொ" onClick={onClick} status={charStatuses['ொ']} crossedStatus={crossedCharStatus['ொ']} />
        <Key value="ோ" onClick={onClick} status={charStatuses['ோ']} crossedStatus={crossedCharStatus['ோ']} />
        <Key value="ௌ" onClick={onClick} status={charStatuses['ௌ']} crossedStatus={crossedCharStatus['ௌ']} />   
        </div>
      <div className="flex justify-center mb-1">
      <Key value="அ" onClick={onClick} status={charStatuses['அ']} crossedStatus={crossedCharStatus['அ']} />
        <Key value="ஆ" onClick={onClick} status={charStatuses['ஆ']} crossedStatus={crossedCharStatus['ஆ']} />
        <Key value="இ" onClick={onClick} status={charStatuses['இ']} crossedStatus={crossedCharStatus['இ']} />
        <Key value="ஈ" onClick={onClick} status={charStatuses['ஈ']} crossedStatus={crossedCharStatus['ஈ']} />
        <Key value="உ" onClick={onClick} status={charStatuses['உ']} crossedStatus={crossedCharStatus['உ']} />
        <Key value="ஊ" onClick={onClick} status={charStatuses['ஊ']} crossedStatus={crossedCharStatus['ஊ']} />
        <Key value="எ" onClick={onClick} status={charStatuses['எ']} crossedStatus={crossedCharStatus['எ']} />
        <Key value="ஏ" onClick={onClick} status={charStatuses['ஏ']} crossedStatus={crossedCharStatus['ஏ']} />
        <Key value="ஐ" onClick={onClick} status={charStatuses['ஐ']} crossedStatus={crossedCharStatus['ஐ']} />
        <Key value="ஒ" onClick={onClick} status={charStatuses['ஒ']} crossedStatus={crossedCharStatus['ஒ']} />
        <Key value="ஓ" onClick={onClick} status={charStatuses['ஓ']} crossedStatus={crossedCharStatus['ஓ']} />
        <Key value="ஔ" onClick={onClick} status={charStatuses['ஔ']} crossedStatus={crossedCharStatus['ஔ']} />
      </div>
      <div className="flex justify-center mb-1">
        <Key value="க" onClick={onClick} status={charStatuses['க']} crossedStatus={crossedCharStatus['க']} />
        <Key value="ச" onClick={onClick} status={charStatuses['ச']} crossedStatus={crossedCharStatus['ச']} />
        <Key value="ட" onClick={onClick} status={charStatuses['ட']} crossedStatus={crossedCharStatus['ட']} />
        <Key value="த" onClick={onClick} status={charStatuses['த']} crossedStatus={crossedCharStatus['த']} />
        <Key value="ப" onClick={onClick} status={charStatuses['ப']} crossedStatus={crossedCharStatus['ப']} />
        <Key value="ற" onClick={onClick} status={charStatuses['ற']} crossedStatus={crossedCharStatus['ற']} />
        <Key value="ங" onClick={onClick} status={charStatuses['ங']} crossedStatus={crossedCharStatus['ங']} />
        <Key value="ஞ" onClick={onClick} status={charStatuses['ஞ']} crossedStatus={crossedCharStatus['ஞ']} />
        <Key value="ண" onClick={onClick} status={charStatuses['ண']} crossedStatus={crossedCharStatus['ண']} />
        <Key value="ந" onClick={onClick} status={charStatuses['ந']} crossedStatus={crossedCharStatus['ந']} />
        <Key value="ம" onClick={onClick} status={charStatuses['ம']} crossedStatus={crossedCharStatus['ம']} />
        <Key value="ன" onClick={onClick} status={charStatuses['ன']} crossedStatus={crossedCharStatus['ன']} />
        </div>
      <div className="flex justify-center">
      <Key size='lg' value="ENTER" onClick={onClick}>
          Enter
        </Key>
        <Key value="ய" onClick={onClick} status={charStatuses['ய']} crossedStatus={crossedCharStatus['ய']} />
        <Key value="ர" onClick={onClick} status={charStatuses['ர']} crossedStatus={crossedCharStatus['ர']} />
        <Key value="ல" onClick={onClick} status={charStatuses['ல']} crossedStatus={crossedCharStatus['ல']} />
        <Key value="வ" onClick={onClick} status={charStatuses['வ']} crossedStatus={crossedCharStatus['வ']} />
        <Key value="ழ" onClick={onClick} status={charStatuses['ழ']} crossedStatus={crossedCharStatus['ழ']} />
        <Key value="ள" onClick={onClick} status={charStatuses['ள']} crossedStatus={crossedCharStatus['ள']} />
        <Key size='lg' value="DELETE" onClick={onClick}>
          <BackspaceIcon width={25} height={25} />
        </Key>
        </div>
    </div>
  )
}
