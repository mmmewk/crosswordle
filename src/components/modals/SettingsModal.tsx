import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setAdvancedKeyboard, setDarkMode } from '../../redux/slices/settingsSlice'
import Switch from 'react-switch';
import { Modal } from './Modal'
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { setOpenModal } from '../../redux/slices/navigationSlice';


export const SettingsModal : React.FC = () => {
  const dispatch = useDispatch();
  const { darkMode, advancedKeyboard } = useSelector((state: RootState) => state.settings);


  return (
    <Modal name='settings' title='அமைப்புகள்'>
      <div className='w-100 p-4 flex items-center'>
        <Switch className='mr-2' checked={darkMode} onChange={(enabled) => dispatch(setDarkMode(enabled))} />
        <span>கருமை நிலை</span>
      </div>
      <div className='w-100 p-4 flex items-center'>
        <Switch className='mr-2' checked={advancedKeyboard} onChange={(enabled) => dispatch(setAdvancedKeyboard(enabled))} />
        <span>மேம்பட்ட விசைப்பலகை</span>
        <QuestionMarkCircleIcon
          className="h-5 w-5 mr-3 cursor-pointer dark:stroke-white ml-1"
          onClick={() => dispatch(setOpenModal('helpKeyboardOnly'))}
        />
      </div>
      <div className="flex mt-3 justify-center">
        <img
          src="https://omtamil.com/logo/sorputhir.png"
          width="100px"
          alt="OMTAMIL"
        ></img>
      </div>
      <small>
        <p className="flex mt-1 justify-center dark:text-gray-300">
          <small>
          </small>
        </p>
      </small>
      <p className="flex justify-center mt-1 dark:text-gray-300">
        மொழி விளையாட்டு செயலி
      </p>
      <p className="mt-3 italic text-lg text-gray-500 dark:text-gray-300">
        'எல்லாச் சொல்லும் பொருள் குறித்தனவே' <small>(தொல்.சொல்.157)</small>
      </p>

      <h1 className="text-sm mt-6 grow font-bold flex underline justify-center dark:text-white">
        உருவாக்கமும் செயற்றிட்டமும்
      </h1>
      <div className="flex items-center justify-center mt-3 dark:text-white">
        <a href="https://twitter.com/muhelen" target="_blank" rel="noreferrer">
          <img
            src="https://omtamil.com/images/muhelen.png"
            width="50px"
            alt="MUHELEN"
          ></img>
        </a>
        <p className="flex justify-right text-sm text-gray-500 dark:text-gray-300">
          {' '}
          <a
            href="https://twitter.com/muhelen"
            target="_blank"
            rel="noreferrer"
            className="text-sm"
          >
            {' '}
            முகிலன் முருகன்<br></br>@muhelen
          </a>
        </p>
        <div className="mx-1"></div>
        <a
          href="https://twitter.com/mullairatha"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://omtamil.com/images/mullai.png"
            width="50px"
            alt="MULLAI"
          ></img>
        </a>
        <p className="flex justify-right text-sm text-gray-500 dark:text-gray-300">
          {' '}
          <a
            href="https://twitter.com/mullairatha"
            target="_blank"
            rel="noreferrer"
            className="text-sm"
          >
            {' '}
            முல்லை இராதா <br></br>@mullairatha
          </a>
        </p>
      </div>
      <p className="text-sm mt-8 text-gray-500 dark:text-gray-300">
        {' '}
        <a
          href="https://www.nytimes.com/games/wordle"
          target="_blank"
          rel="noreferrer"
          className="underline font-bold"
        >
          Wordle
        </a>{' '},{' '}
        <a
          href="https://crosswordle.mekoppe.com"
          target="_blank"
          rel="noreferrer"
          className="underline font-bold"
        >
          Crosswordle
        </a>{' '}
        விளையாட்டு அடிப்படையில் <br></br>
        <a
          href="https://github.com/omtamil/sorputhir"
          target="_blank"
          rel="noreferrer"
          className="underline font-bold"
        >
          GitHub
        </a>{' '}
        திறமூல நிரலாக வெளியிடப்பட்டது
      </p>

      <p className="flex mt-8 justify-center dark:text-gray-300">
        <small>© 2012-2022 OMTAMIL DOTCOM (002135971-U)</small>
      </p>
    </Modal>
  )
}
