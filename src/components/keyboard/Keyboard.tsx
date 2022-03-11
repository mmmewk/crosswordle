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
  onShift: () => void
  guesses: string[];
  crossedGuesses: string[];
  index: number;
  crossedIndex?: number;
  isShifted: boolean
  uyirmei: string
}

export const Keyboard = ({ solution, crossedSolution, onChar, onDelete, onEnter, onShift,
  guesses, uyirmei, crossedGuesses, index, crossedIndex, isShifted,
}: Props) => {
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
    } else if (value === 'SHIFT') {
      onShift()
    } else if (value === 'DELETE') {
      onDelete()
    } else {
      onChar(value)
      if (isShifted) onShift()
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else if (e.key === 'Shift') {
        onShift()
      } else {
        const key = e.key.toUpperCase()
        if (key.length === 1 && key >= 'ஃ' && key <= 'வ' && 
        !(key >= 'ா' && key <= '்') ) {
          onChar(key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onShift, onChar])

  if (isShifted) {
    return (
      <div className='mt-auto md:mt-none mb-3'>
        <div className="flex justify-center mb-1">
      <Key value='' onClick={onClick} status={charStatuses['']} crossedStatus={crossedCharStatus['']} />
      <Key value="ா" onClick={onClick} status={charStatuses['ா']} crossedStatus={crossedCharStatus['ா']} />
        <Key value="ி" onClick={onClick} status={charStatuses['ி']} crossedStatus={crossedCharStatus['ி']} />
        <Key value="ீ" onClick={onClick} status={charStatuses['ீ']} crossedStatus={crossedCharStatus['ீ']} />
        <div className="mx-0.5"></div>
        <Key value="க்" onClick={onClick} status={charStatuses['க்']} crossedStatus={crossedCharStatus['க்']} />
        <Key value="ச்" onClick={onClick} status={charStatuses['ச்']} crossedStatus={crossedCharStatus['ச்']} />
        <Key value="ட்" onClick={onClick} status={charStatuses['ட்']} crossedStatus={crossedCharStatus['ட்']} />
        <Key value="த்" onClick={onClick} status={charStatuses['த்']} crossedStatus={crossedCharStatus['த்']} />
        <Key value="ப்" onClick={onClick} status={charStatuses['ப்']} crossedStatus={crossedCharStatus['ப்']} />
        <Key value="ற்" onClick={onClick} status={charStatuses['ற்']} crossedStatus={crossedCharStatus['ற்']} />

      </div>
      <div className="flex justify-center mb-1">
        <Key value='ு' onClick={onClick} status={charStatuses['ு']} crossedStatus={crossedCharStatus['ு']} />
        <Key value="ூ" onClick={onClick} status={charStatuses['ூ']} crossedStatus={crossedCharStatus['ூ']} />
        <Key value="ெ" onClick={onClick} status={charStatuses['ெ']} crossedStatus={crossedCharStatus['ெ']} />
        <Key value="ே" onClick={onClick} status={charStatuses['ே']} crossedStatus={crossedCharStatus['ே']} />
        <div className="mx-0.5"></div>
        <Key value="ங்" onClick={onClick} status={charStatuses['ங்']} crossedStatus={crossedCharStatus['ங்']} />
        <Key value="ஞ்" onClick={onClick} status={charStatuses['ஞ்']} crossedStatus={crossedCharStatus['ஞ்']} />
        <Key value="ண்" onClick={onClick} status={charStatuses['ண்']} crossedStatus={crossedCharStatus['ண்']} />
        <Key value="ந்" onClick={onClick} status={charStatuses['ந்']} crossedStatus={crossedCharStatus['ந்']} />
        <Key value="ம்" onClick={onClick} status={charStatuses['ம்']} crossedStatus={crossedCharStatus['ம்']} />
        <Key value="ன்" onClick={onClick} status={charStatuses['ன்']} crossedStatus={crossedCharStatus['ன்']} />
        </div>
        <div className="flex justify-center mb-1">
        <Key value="ை" onClick={onClick} status={charStatuses['ை']} crossedStatus={crossedCharStatus['ை']} />
        <Key value="ொ" onClick={onClick} status={charStatuses['ொ']} crossedStatus={crossedCharStatus['ொ']} />
        <Key value="ோ" onClick={onClick} status={charStatuses['ோ']} crossedStatus={crossedCharStatus['ோ']} />
        <Key value="ௌ" onClick={onClick} status={charStatuses['ௌ']} crossedStatus={crossedCharStatus['ௌ']} /> 
        <div className="mx-0.5"></div>
        <Key value="ய்" onClick={onClick} status={charStatuses['ய்']} crossedStatus={crossedCharStatus['ய்']} />
        <Key value="ர்" onClick={onClick} status={charStatuses['ர்']} crossedStatus={crossedCharStatus['ர்']} />
        <Key value="ல்" onClick={onClick} status={charStatuses['ல்']} crossedStatus={crossedCharStatus['ல்']} />
        <Key value="வ்" onClick={onClick} status={charStatuses['வ்']} crossedStatus={crossedCharStatus['வ்']} />
        <Key value="ழ்" onClick={onClick} status={charStatuses['ழ்']} crossedStatus={crossedCharStatus['ழ்']} />
        <Key value="ள்" onClick={onClick} status={charStatuses['ள்']} crossedStatus={crossedCharStatus['ள்']} />
         </div>
         <div className="flex justify-center mb-1">
        <Key size='lg' value="ENTER" onClick={onClick}>
        ⏎
        </Key>
        <Key size='lg' value="DELETE" onClick={onClick}>
          <BackspaceIcon width={25} height={25} />
        </Key>
           </div>
        </div>
    )
  } else {
    return (
      <div className='mt-auto md:mt-none mb-3'>
      <div className="flex justify-center mb-1">
      <Key value="அ" onClick={onClick} status={charStatuses['அ']} crossedStatus={crossedCharStatus['அ']} />
        <Key value="ஆ" onClick={onClick} status={charStatuses['ஆ']} crossedStatus={crossedCharStatus['ஆ']} />
        <Key value="இ" onClick={onClick} status={charStatuses['இ']} crossedStatus={crossedCharStatus['இ']} />
        <Key value="ஈ" onClick={onClick} status={charStatuses['ஈ']} crossedStatus={crossedCharStatus['ஈ']} />
        <div className="mx-0.5"></div>
        <Key value="க்" onClick={() => {onClick('க்'); onShift();}} status={charStatuses['க்']} crossedStatus={crossedCharStatus['க்']} />
        <Key value="ச்" onClick={() => {onClick('ச்'); onShift();}} status={charStatuses['ச்']} crossedStatus={crossedCharStatus['ச்']} />
        <Key value="ட்" onClick={() => {onClick('ட்'); onShift();}} status={charStatuses['ட்']} crossedStatus={crossedCharStatus['ட்']} />
        <Key value="த்" onClick={() => {onClick('த்'); onShift();}} status={charStatuses['த்']} crossedStatus={crossedCharStatus['த்']} />
        <Key value="ப்" onClick={() => {onClick('ப்'); onShift();}} status={charStatuses['ப்']} crossedStatus={crossedCharStatus['ப்']} />
        <Key value="ற்" onClick={() => {onClick('ற்'); onShift();}} status={charStatuses['ற்']} crossedStatus={crossedCharStatus['ற்']} />
      </div>
      <div className="flex justify-center mb-1">
        <Key value="உ" onClick={onClick} status={charStatuses['உ']} crossedStatus={crossedCharStatus['உ']} />
        <Key value="ஊ" onClick={onClick} status={charStatuses['ஊ']} crossedStatus={crossedCharStatus['ஊ']} />
        <Key value="எ" onClick={onClick} status={charStatuses['எ']} crossedStatus={crossedCharStatus['எ']} />
        <Key value="ஏ" onClick={onClick} status={charStatuses['ஏ']} crossedStatus={crossedCharStatus['ஏ']} />
        <div className="mx-0.5"></div>
        <Key value="ங்" onClick={() => {onClick('ங்'); onShift();}} status={charStatuses['ங்']} crossedStatus={crossedCharStatus['ங்']} />
        <Key value="ஞ்" onClick={() => {onClick('ஞ்'); onShift();}} status={charStatuses['ஞ்']} crossedStatus={crossedCharStatus['ஞ்']} />
        <Key value="ண்" onClick={() => {onClick('ண்'); onShift();}} status={charStatuses['ண்']} crossedStatus={crossedCharStatus['ண்']} />
        <Key value="ந்" onClick={() => {onClick('ந்'); onShift();}} status={charStatuses['ந்']} crossedStatus={crossedCharStatus['ந்']} />
        <Key value="ம்" onClick={() => {onClick('ம்'); onShift();}} status={charStatuses['ம்']} crossedStatus={crossedCharStatus['ம்']} />
        <Key value="ன்" onClick={() => {onClick('ன்'); onShift();}} status={charStatuses['ன்']} crossedStatus={crossedCharStatus['ன்']} />
        </div>
        <div className="flex justify-center mb-1">
        <Key value="ஐ" onClick={onClick} status={charStatuses['ஐ']} crossedStatus={crossedCharStatus['ஐ']} />
        <Key value="ஒ" onClick={onClick} status={charStatuses['ஒ']} crossedStatus={crossedCharStatus['ஒ']} />
        <Key value="ஓ" onClick={onClick} status={charStatuses['ஓ']} crossedStatus={crossedCharStatus['ஓ']} />
        <Key value="ஔ" onClick={onClick} status={charStatuses['ஔ']} crossedStatus={crossedCharStatus['ஔ']} />
        <div className="mx-0.5"></div>
        <Key value="ய்" onClick={() => {onClick('ய்'); onShift();}} status={charStatuses['ய்']} crossedStatus={crossedCharStatus['ய்']} />
        <Key value="ர்" onClick={() => {onClick('ர்'); onShift();}} status={charStatuses['ர்']} crossedStatus={crossedCharStatus['ர்']} />
        <Key value="ல்" onClick={() => {onClick('ல்'); onShift();}} status={charStatuses['ல்']} crossedStatus={crossedCharStatus['ல்']} />
        <Key value="வ்" onClick={() => {onClick('வ்'); onShift();}} status={charStatuses['வ்']} crossedStatus={crossedCharStatus['வ்']} />
        <Key value="ழ்" onClick={() => {onClick('ழ்'); onShift();}} status={charStatuses['ழ்']} crossedStatus={crossedCharStatus['ழ்']} />
        <Key value="ள்" onClick={() => {onClick('ள்'); onShift();}} status={charStatuses['ள்']} crossedStatus={crossedCharStatus['ள்']} />
        </div>
        <div className="flex justify-center mb-1">
        <Key size='lg' value="ENTER" onClick={onClick}>
        ⏎
        </Key>
        <Key size='lg' value="DELETE" onClick={onClick}>
          <BackspaceIcon width={25} height={25} />
        </Key>
           </div>
    </div>
    )
  }
}
