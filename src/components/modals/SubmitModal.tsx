import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import { trackEvent } from '../../lib/analytics'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const SubmitModal = ({ isOpen, handleClose }: Props) => {
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
                    Submit a crosswordle
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      If you enjoy the crosswordle and are good at making crosswords consider submitting your own crosswordle for everyone to play!
                    </p>
                    <p className='text-sm mt-3 text-gray-500'>
                      First build a 5x5 crossword puzzle using only words in the english dictionary. I recommend using{' '}
                      <a href="https://crosshare.org/construct" className="underline font-bold" target="_blank" rel="noreferrer" onClick={() => trackEvent('open_crosshare')}>Crosshare.org</a>.
                    </p>
                    <p className='text-sm mt-3 text-gray-500'>
                      Then take a screenshot of your crossword and email it to{' '}
                      <a href="mailto:crosswordle.submissions@gmail.com" className="underline font-bold" target="_blank" rel="noreferrer" onClick={() => trackEvent('email_submission')}>crosswordle.submissions@gmail.com</a>
                      {' '}along with your name so you can get credit for the puzzle!
                    </p>
                    <p className='mt-3 text-gray-500'>A couple tips:</p>
                    <ul style={{ listStyle: 'inside', textAlign: 'left' }} className='text-gray-500'>
                      <li>Try and minimize the number of 2 and 3 letter words that you use as these require a significant amount of luck.</li>
                      <li>If you do use short words make sure that all of their letters are used in both down and across directions.</li>
                      <li>Generally try to keep to somewhat commonly known words, its no fun trying to guess <b>zibeb</b>.</li>
                    </ul>
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
