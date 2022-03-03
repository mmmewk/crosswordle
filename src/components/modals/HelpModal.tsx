import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Cell } from '../grid/Cell'
import { XCircleIcon } from '@heroicons/react/outline'
import { Key } from '../keyboard/Key'

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  onlyKeyboard?: boolean;
}

export const HelpModal = ({ isOpen, handleClose, onlyKeyboard = false }: Props) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div className="absolute right-4 top-4">
                <XCircleIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => handleClose()}
                />
              </div>
              <div>
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    {onlyKeyboard ? 'Keyboard' : 'How to play'}
                  </Dialog.Title>
                  <div className="mt-2">
                    {!onlyKeyboard && (
                      <>
                        <p className="text-sm text-gray-500">
                          Solve the Crosswordle by guessing the WORDLE for each down and across word.
                          Click on a row in the crossword to begin guessing. You have 6 tries to guess each word.
                          After each guess the color of the tiles will change to show how close your guess was
                          to the word.
                        </p>

                        <div className="flex justify-center mb-1 mt-4">
                          <Cell value="W" status="correct" />
                          <Cell value="E" />
                          <Cell value="A" />
                          <Cell value="R" />
                          <Cell value="Y" />
                        </div>
                        <p className="text-sm text-gray-500">
                          The letter W is in the word and in the correct spot.
                        </p>

                        <div className="flex justify-center mb-1 mt-4">
                          <Cell value="P" />
                          <Cell value="I" />
                          <Cell value="L" status="present" />
                          <Cell value="O" />
                          <Cell value="T" />
                        </div>
                        <p className="text-sm text-gray-500">
                          The letter L is in the word but in the wrong spot.
                        </p>

                        <div className="flex justify-center mb-1 mt-4">
                          <Cell value="V" />
                          <Cell value="A" />
                          <Cell value="G" />
                          <Cell value="U" status="absent" />
                          <Cell value="E" />
                        </div>
                        <p className="text-sm text-gray-500">
                          The letter U is not in the word in any spot.
                        </p>

                        <br />
                        <p className="text-sm text-gray-500">
                          If you are stuck on a word you can try solving the words that cross it.
                          Click on the selected tile to change directions.
                          Once a letter has been found in any word crossing a letter it will show up in green.
                        </p>

                        <div className="flex justify-center mb-1 mt-4">
                          <Cell value="S" />
                          <Cell value="T" />
                          <Cell value="A" />
                          <Cell value="N" />
                          <Cell knownValue="D" />
                        </div>
                        <p className="text-sm text-gray-500">
                          The letter D is known to be in this spot because it has been found in either the down or across clue.
                        </p>
                        <br />
                        <h4>Keyboard</h4>
                      </>
                    )}
                    <p className='text-sm text-gray-500'>The virtual keyboard will update to reflect given information on the selected word.</p>
                    <div className="flex mb-1 mt-4 items-center">
                      <div className='grow mr-2'>
                        <Key value="X"/>
                      </div>
                      <p className="text-sm text-gray-500 text-left">The letter X might appear in the selected word.</p>
                    </div>
                    <div className="flex mb-1 mt-4 items-center">
                      <div className='grow mr-2'>
                        <Key value="Y" status='present'/>
                      </div>
                      <p className="text-sm text-gray-500 text-left">The letter Y appears in the selected word but is in the wrong position.</p>
                    </div>
                    <div className="flex mb-1 mt-4 items-center">
                      <div className='grow mr-2'>
                        <Key value="Z" status='correct'/>
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
                        <Key value="X" crossedStatus='absent'/>
                      </div>
                      <p className="text-sm text-gray-500 text-left">The letter X might appear in the selected word but is not the selected letter.</p>
                    </div>
                    <div className="flex mb-1 mt-4 items-center">
                      <div className='grow mr-2'>
                        <Key value="Y" status='present' crossedStatus='absent'/>
                      </div>
                      <p className="text-sm text-gray-500 text-left">The letter Y appears in the selected word but is not the selected letter.</p>
                    </div>
                    <div className="flex mb-1 mt-4 items-center">
                      <div className='grow mr-2'>
                        <Key value="Z" status='correct' crossedStatus='absent'/>
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
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
