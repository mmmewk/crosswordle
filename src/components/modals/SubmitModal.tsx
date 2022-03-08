import { trackEvent } from '../../lib/analytics'
import { Modal } from './Modal'

export const SubmitModal : React.FC = () => {
  return (
    <Modal name='submit' title='Submit a Crosswordle' returnTo='share'>
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
    </Modal>
  )
}
