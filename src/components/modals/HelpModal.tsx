import { Cell } from '../grid/Cell'
import { PencilIcon } from '@heroicons/react/outline'
import { Key } from '../keyboard/Key'
import { Modal } from './Modal'

type Props = {
  onlyKeyboard?: boolean;
}

export const HelpModal : React.FC<Props> = ({ onlyKeyboard = false }) => {
  const title = onlyKeyboard ? 'Keyboard' : 'How to Play';
  const name = onlyKeyboard ? 'helpKeyboardOnly' : 'help';
  const returnTo = onlyKeyboard ? 'settings' : undefined;

  return (
    <Modal name={name} title={title} returnTo={returnTo}>
      {!onlyKeyboard && (
        <>
          <p className="text-sm text-gray-500">
            Solve the Crosswordle by guessing the WORDLE for each down and across word.
            Click on a row in the crossword to begin guessing. You have 6 tries to guess each word.
            After each guess the color of the tiles will change to show how close your guess was
            to the word.
          </p>

          <div className="flex justify-center mb-1 mt-4">
            <Cell value="R" status="correct" />
            <Cell value="I" />
            <Cell value="G" />
            <Cell value="H" />
            <Cell value="T" />
          </div>
          <p className="text-sm text-gray-500">
            The letter R is in the word and in the correct spot.
          </p>

          <div className="flex justify-center mb-1 mt-4">
            <Cell value="C" />
            <Cell value="L" status="present" />
            <Cell value="O" />
            <Cell value="S" />
            <Cell value="E" />
          </div>
          <p className="text-sm text-gray-500">
            The letter L is in the word but in the wrong spot.
          </p>

          <div className="flex justify-center mb-1 mt-4">
            <Cell value="W" />
            <Cell value="R" />
            <Cell value="O" status="absent" />
            <Cell value="N" />
            <Cell value="G" />
          </div>
          <p className="text-sm text-gray-500">
            The letter O is not in the word in any spot.
          </p>

          <br />
          <p className="text-sm text-gray-500">
            If you are stuck on a word you can try solving the words that cross it.
            Click on the selected tile to change directions.
            Once a letter has been found in any word crossing a letter it will show up in green.
          </p>

          <div className="flex justify-center mb-1 mt-4">
            <Cell value="K" />
            <Cell value="N" />
            <Cell value="O" />
            <Cell value="W" mode="known" />
            <Cell value="N" />
          </div>
          <p className="text-sm text-gray-500">
            The letter W is known to be in this spot because it has been found in either the down or across clue.
          </p>
          <br />
          <p className="text-sm text-gray-500">
            If you would like to make a note on the crossword that you know what a letter goes in a specific location,
            enable pencil mode. Just click the <PencilIcon width={15} height={15} className='inline'/> icon to toggle pencil mode.
          </p>

          <div className="flex justify-center mb-1 mt-4">
            <Cell value="N" />
            <Cell value="O" />
            <Cell value="T" />
            <Cell value="E" />
            <Cell value="S" mode="pencil" />
          </div>
          <p className="text-sm text-gray-500">
            The you have noted that the letter S is probably in this spot.
          </p>
          <br />
          <h4>Keyboard</h4>
        </>
      )}
      <p className='text-sm text-gray-500'>The virtual keyboard will update to reflect given information on the selected word.</p>
      <div className="flex mb-1 mt-4 items-center">
        <div className='grow mr-2'>
          <Key value="அ"/>
        </div>
        <p className="text-sm text-gray-500 text-left">The letter X might appear in the selected word.</p>
      </div>
      <div className="flex mb-1 mt-4 items-center">
        <div className='grow mr-2'>
          <Key value="ஆ" status='present'/>
        </div>
        <p className="text-sm text-gray-500 text-left">The letter Y appears in the selected word but is in the wrong position.</p>
      </div>
      <div className="flex mb-1 mt-4 items-center">
        <div className='grow mr-2'>
          <Key value="இ" status='correct'/>
        </div>
        <p className="text-sm text-gray-500 text-left">
          The letter Z appears in the selected word and was previously guessed in the correct position.
          It may appear another time.
        </p>
      </div>
      <br />
      <h4>Advanced Keyboard</h4>
      <p className="text-sm text-gray-500">With the advanced keyboard enabled you will additionally see these keys</p>
      <div className="flex mb-1 mt-4 items-center">
        <div className='grow mr-2'>
          <Key value="உ" crossedStatus='absent'/>
        </div>
        <p className="text-sm text-gray-500 text-left">The letter X might appear in the selected word but is not the selected letter.</p>
      </div>
      <div className="flex mb-1 mt-4 items-center">
        <div className='grow mr-2'>
          <Key value="ஊ" status='present' crossedStatus='absent'/>
        </div>
        <p className="text-sm text-gray-500 text-left">The letter Y appears in the selected word but is not the selected letter.</p>
      </div>
      <div className="flex mb-1 mt-4 items-center">
        <div className='grow mr-2'>
          <Key value="எ" status='correct' crossedStatus='absent'/>
        </div>
        <p className="text-sm text-gray-500 text-left">
          The letter Z appears in the selected word and was previously guessed in the correct position.
          It may appear another time, but is not the selected letter.
        </p>
      </div>
      <br />
      <p className="text-sm text-gray-500">
        When you type a letter the next letter in the word will automatically be selected.
      </p>
    </Modal>
  )
}
