import * as smoothscroll from 'smoothscroll-polyfill';
import { InformationCircleIcon, QuestionMarkCircleIcon, PresentationChartBarIcon, DocumentAddIcon } from '@heroicons/react/outline';
import { ElementRef, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid } from './components/grid/Grid';
import { Keyboard } from './components/keyboard/Keyboard';
import { AboutModal } from './components/modals/AboutModal';
import { HelpModal } from './components/modals/HelpModal';
import { ShareModal } from './components/modals/ShareModal';
import { isWordInWordList } from './lib/words';
import './App.scss';
import { getInitialClue, getTotalGuesses, notEmpty } from './lib/utils';
import { crosswordIndex, crossword as crosswordData } from './lib/utils';
import { CellColors } from './components/mini-crossword/MiniCrossword';
import { WORDLE_CORRECT_COLOR, WORDLE_LOSE_COLOR, WORDLE_MISPLACED_COLOR, WORDLE_WRONG_COLOR } from './constants/colors';
import { Crossword } from './components/crossword/Crossword';
import { CellData, Direction, GridData, UsedCellData, WordInput } from './types';
import { trackEvent, trackGameEnd, trackGuess } from './lib/analytics';
import { useGameState } from './redux/hooks/useGameState';
import { SubmitModal } from './components/modals/SubmitModal';
import { otherDirection } from './lib/crossword-utils';

smoothscroll.polyfill();
const { initialClue, initialDirection } = getInitialClue(crosswordData);
if (window.location.origin === 'http://www.crosswordle.mekoppe.com') window.location.href = 'https://crosswordle.mekoppe.com';

function App() {
  const crosswordRef = useRef<ElementRef<typeof Crossword>>(null);
  const {
    isGameWon,
    lostCell,
    guesses,
    shareHistory,
    addGuess: addGuessToState,
    pushShareHistory,
    win,
    lose,
  } = useGameState(crosswordIndex);
  const [knownLetters, setKnownLetters] = useState<(string | undefined)[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentWord, setCurrentWord] = useState(initialClue.answer);
  const [crossedWord, setCrossedWord] = useState<string | undefined>();
  const [isShareModalOpen, setIsShareModalOpen] = useState(isGameWon);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [focusedWordData, setFocusedWordData] = useState<WordInput>(initialClue);
  const [focusedDirection, setFocusedDirection] = useState<Direction>(initialDirection);
  const [focusedNumber, setFocusedNumber] = useState<string>('1');
  const [crossedNumber, setCrossedNumber] = useState<string | undefined>(undefined);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // After keyboard input move to the next square where you can type
  const moveToNextGuessSquare = useCallback((step: number) => {
    let { row, col } = focusedWordData;
    if (focusedDirection === 'across') col += currentGuess.length + step;
    if (focusedDirection === 'down') row += currentGuess.length + step;
    crosswordRef.current?.moveTo(row, col);
  }, [focusedDirection, currentGuess, crosswordRef, focusedWordData]);

  // Key event callbacks
  const onChar = (value: string) => {
    const guessesForWord = guesses[focusedDirection][focusedNumber];

    if (currentGuess.length < currentWord.length && guessesForWord.length < 6) {
      setCurrentGuess(`${currentGuess}${value}`);
      moveToNextGuessSquare(1);
    }
  }

  const onDelete = () => {
    moveToNextGuessSquare(-1);
    setCurrentGuess(currentGuess.slice(0, -1));
  }

  // Callbacks to keep move history in sync with guesses
  const updateShareHistory = useCallback((guess: string) => {
    const { row, col, answer } = focusedWordData;
    const previousCellColors = shareHistory.slice(-1)[0] || {};
    const newCellColors = Object.keys(previousCellColors).reduce((cellColors, key) => {
      if (previousCellColors[key] === WORDLE_CORRECT_COLOR) cellColors[key] = previousCellColors[key];
      return cellColors;
    }, {} as CellColors)

    guess.split('').forEach((letter, index) => {
      const newRow = row + (focusedDirection === 'across' ? 0 : index);
      const newCol = col + (focusedDirection === 'across' ? index : 0);

      if (newCellColors[`${newRow}_${newCol}`] === WORDLE_CORRECT_COLOR) return;

      if (letter === answer[index]) {
        newCellColors[`${newRow}_${newCol}`] = WORDLE_CORRECT_COLOR;
      } else if (answer.includes(letter)) {
        newCellColors[`${newRow}_${newCol}`] = WORDLE_MISPLACED_COLOR;
      } else {
        newCellColors[`${newRow}_${newCol}`] = WORDLE_WRONG_COLOR;
      }
    });

    pushShareHistory(newCellColors);
  }, [shareHistory, pushShareHistory, focusedWordData, focusedDirection]);

  const updateShareHistoryWithLoss = useCallback((cell: UsedCellData) => {
    const previousCellColors = shareHistory.slice(-1)[0] || {};
    const key = `${cell.row}_${cell.col}`;

    pushShareHistory({ ...previousCellColors, [key]: WORDLE_LOSE_COLOR });
  }, [shareHistory, pushShareHistory])

  const addGuess = (guess: string) => {
    trackGuess(crosswordIndex, guess);
    addGuessToState(focusedDirection, focusedNumber, guess);

    crosswordRef.current?.guessWord(currentGuess);

    updateShareHistory(guess);
  };

  // Check for game win or game loss
  const isCellLost = useCallback((cell: UsedCellData) => {
    if (cell.guess === cell.answer) return false;

    if (cell.across && cell.down) {
      return guesses.across[cell.across].length >= 6 && guesses.down[cell.down].length >= 6;
    } else if (cell.across) {
      return guesses.across[cell.across].length >= 6;
    } else if (cell.down) {
      return guesses.down[cell.down].length >= 6;
    }

    return false;
  }, [guesses]);

  const checkWinOrLoss = (gridData: GridData) => {
    if (isGameWon || lostCell) return;

    let gameLost = false;

    const crosswordCorrect = gridData.every((row) => {
      return row.every((cell) => {
        if (!cell.used) return true;
        if (isCellLost(cell)) {
          gameLost = true;
          lose(cell);
          updateShareHistoryWithLoss(cell);
          setIsShareModalOpen(true);
          return false;
        }
        return cell.guess === cell.answer;
      });
    });

    const totalGuesses = getTotalGuesses(guesses);

    if (gameLost) {
      trackGameEnd(crosswordIndex, 'game_lost', totalGuesses);
    }

    if (crosswordCorrect) {
      trackGameEnd(crosswordIndex, 'game_won', totalGuesses);
      win();
      setIsShareModalOpen(true);
    }
  };

  const onEnter = () => {
    if (currentGuess.length !== currentWord.length) return;

    // Alert user if guess is not a word
    if (!isWordInWordList(currentGuess) && currentGuess !== currentWord) {
      toast.error('Word not found');
      return;
    }

    const guessesForWord = guesses[focusedDirection][focusedNumber];

    if (currentGuess.length === currentWord.length && guessesForWord.length < 6 && !guessesForWord.includes(currentGuess)) {
      addGuess(currentGuess)
      setCurrentGuess('');
    }
  };

  const onGridDataChange = (gridData: GridData, knownLetters: (string | undefined)[]) => {
    checkWinOrLoss(gridData);
    setKnownLetters(knownLetters);
  };

  const onMoved = (cell: CellData, direction: Direction, knownLetters: (string | undefined)[]) => {
    if (!cell.used) return;

    const number = cell[direction] || '';
    const otherNumber = cell[otherDirection(direction)];
    const wordData = crosswordData[direction][number];
    const crossedWordData = otherNumber ? crosswordData[otherDirection(direction)][otherNumber] : undefined;
    setCurrentWord(wordData.answer);
    setCrossedWord(crossedWordData?.answer);
    setFocusedWordData(wordData);
    setFocusedNumber(number);
    setCrossedNumber(otherNumber);
    setFocusedDirection(direction);
    setKnownLetters(knownLetters);
    setFocusedIndex(cell.row - wordData.row || cell.col - wordData.col);
  };

  useEffect(() => {
    setCurrentGuess('');
  }, [focusedDirection, focusedNumber]);

  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex w-screen mx-auto items-center border-b-slate-400 border-b-[1px] p-4">
        <div className='grow'>
          <h1 className="text-l md:text-xl font-bold whitespace-nowrap">Crosswordle {crosswordIndex + 1}</h1>
          <p className="text-sm text-slate-400">By {crosswordData.author || 'Matthew Koppe'}</p>
        </div>
        <PresentationChartBarIcon
          className="h-6 w-6 ml-3 mr-3 cursor-pointer"
          onClick={() => setIsShareModalOpen(true)}
        />
        <ShareModal
          isOpen={isShareModalOpen}
          openSubmitModal={() => {
            setIsShareModalOpen(false);
            setIsSubmitModalOpen(true);
          }}
          handleClose={() => setIsShareModalOpen(false)}
        />
        <InformationCircleIcon
          className="h-6 w-6 mr-3 cursor-pointer"
          onClick={() => setIsAboutModalOpen(true)}
        />
        <AboutModal
          isOpen={isAboutModalOpen}
          handleClose={() => setIsAboutModalOpen(false)}
        />
        <QuestionMarkCircleIcon
          className="h-6 w-6 mr-3 cursor-pointer"
          onClick={() => setIsHelpModalOpen(true)}
        />
        <HelpModal
          isOpen={isHelpModalOpen}
          handleClose={() => setIsHelpModalOpen(false)}
        />
        <DocumentAddIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => {
            trackEvent('open_submit_modal');
            setIsSubmitModalOpen(true)
          }}
        />
        <SubmitModal
          isOpen={isSubmitModalOpen}
          handleClose={() => setIsSubmitModalOpen(false)}
        />
      </div>
      <div className='flex flex-1 flex-col w-screen overflow-x-hidden md:flex-row lg:flex-row'>
        <div className='w-full flex md:items-center justify-center p-2 px-20 md:p-6 md:w-1/2' >
          <div className='max-w-[300px] md:max-w-[500px] w-full h-full justify-center flex flex-col max-width-static-mobile'>
            <Crossword onMoved={onMoved} onChange={onGridDataChange} ref={crosswordRef} guess={currentGuess} />
          </div>
        </div>
        <div className='w-full flex flex-1 md:items-center md:w-1/2 md:border-l border-slate-400'>
          <div className="md:py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 keyboard">
            <Grid
              guesses={guesses[focusedDirection][focusedNumber] || []}
              currentGuess={currentGuess}
              knownLetters={knownLetters}
              solution={currentWord}
              focusedIndex={focusedIndex}
            />
            <Keyboard
              solution={currentWord}
              crossedSolution={crossedWord}
              knownChars={knownLetters.filter(notEmpty)}
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              guesses={guesses[focusedDirection][focusedNumber] || []}
              crossGuesses={crossedNumber ? guesses[otherDirection(focusedDirection)][crossedNumber] : []}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
