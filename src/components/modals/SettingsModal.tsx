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
    <Modal name='settings' title='Settings'>
      <div className='w-100 p-4 flex items-center'>
        <Switch className='mr-2' checked={darkMode} onChange={(enabled) => dispatch(setDarkMode(enabled))} />
        <span>Dark Mode</span>
      </div>
      <div className='w-100 p-4 flex items-center'>
        <Switch className='mr-2' checked={advancedKeyboard} onChange={(enabled) => dispatch(setAdvancedKeyboard(enabled))} />
        <span>Advanced Keyboard</span>
        <QuestionMarkCircleIcon
          className="h-5 w-5 mr-3 cursor-pointer dark:stroke-white ml-1"
          onClick={() => dispatch(setOpenModal('helpKeyboardOnly'))}
        />
      </div>
    </Modal>
  )
}
