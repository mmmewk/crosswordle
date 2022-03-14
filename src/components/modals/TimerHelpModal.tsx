import { Modal } from './Modal'

export const TimerHelpModal : React.FC = () => {
  return (
    <Modal name='timerHelp' title='Timer' returnTo='settings'>
      <p className="text-sm text-gray-500">
        This setting allows you to see how long it took you to solve the crosswordle. It is disabled by default
        because the original metric for how well you did on a crosswordle puzzle was number of guesses used.
        Solving the crosswordle quickly will naturally cause you to use more guesses.
      </p>
      <br />
      <p className="text-sm text-gray-500">
        The timer starts when you input your first guess and ends when you complete the puzzle.
      </p>
    </Modal>
  )
}
