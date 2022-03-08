import { Modal } from './Modal'

export const AboutModal : React.FC = () => {
  return (
    <Modal name='about' title='About'>
      <p className="text-sm text-gray-500">
        This is an open source variation of the game wordle
        where you solve a daily mini crossword using wordle rules -{' '}
        <a
          href="https://www.powerlanguage.co.uk/wordle/"
          className="underline font-bold"
          target="_blank"
          rel="noreferrer"
        >
          play the wordle here
        </a>
        {' '}and{' '}
        <a
          href="https://www.nytimes.com/crosswords/game/mini"
          className="underline font-bold"
          target="_blank"
          rel="noreferrer"
        >
          play the daily crossword mini here
        </a>. Crosswords are hand made using{' '}
        <a
          href="https://crosshare.org/"
          className="underline font-bold"
          target="_blank"
          rel="noreferrer"
        >
          Crosshare.org
        </a> by the crosswordle community. Thanks to everyone who has submitted a puzzle!
      </p>
    </Modal>
  );
}
