import * as smoothscroll from 'smoothscroll-polyfill';
import { InformationCircleIcon, QuestionMarkCircleIcon, PresentationChartBarIcon } from '@heroicons/react/outline';
import { ElementRef, useCallback, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid } from './components/grid/Grid';
import { Keyboard } from './components/keyboard/Keyboard';
import { AboutModal } from './components/modals/AboutModal';
import { HelpModal } from './components/modals/HelpModal';
import { ShareModal } from './components/modals/ShareModal';
import { isWordInWordList } from './lib/words';
import {
  Guesses,
  initialStateFromLocalStorage,
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  generateInitialGuessState,
} from './lib/localStorage';
import './App.css';
import { gameProgress, getTotalGuesses, notEmpty } from './lib/utils';
import { crosswordIndex, crossword as crosswordData } from './lib/utils';
import { CellColors } from './components/mini-crossword/MiniCrossword';
import { WORDLE_CORRECT_COLOR, WORDLE_LOSE_COLOR, WORDLE_MISPLACED_COLOR, WORDLE_WRONG_COLOR } from './constants/colors';
import { Crossword as MyCrossword } from './components/crossword/Crossword';
import { get } from 'lodash';
import { CellData, Direction, GridData, UsedCellData, WordInput } from './components/crossword/types';
import { trackGameEnd, trackGameProgress, trackGuess } from './lib/analytics';

smoothscroll.polyfill();
const initialClue = get(crosswordData, 'across.1', get(crosswordData, 'down.1')) as WordInput;
if (window.location.origin === 'http://www.crosswordle.mekoppe.com') window.location.href = 'https://crosswordle.mekoppe.com';

function App() {
  const crosswordRef = useRef<ElementRef<typeof MyCrossword>>(null);
  const [knownLetters, setKnownLetters] = useState<(string | undefined)[]>([]);
  const [resetCrossword, setResetCrossword] = useState(() => {
    const loaded = loadGameStateFromLocalStorage();
    return !loaded || loaded.crosswordIndex !== crosswordIndex;
  });
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentWord, setCurrentWord] = useState(initialClue.answer);
  const [isShareModalOpen, setIsShareModalOpen] = useState(() => {
    const loaded = loadGameStateFromLocalStorage();
    if (!loaded || loaded.crosswordIndex !== crosswordIndex) return false;
    return Boolean(loaded.lostCell) || loaded.isGameWon;
  });
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(
    initialStateFromLocalStorage<boolean>({ key: 'isGameWon', defaultValue: false, crosswordIndex })
  );
  const [lostCell, setLostCell] = useState<UsedCellData | null>(
    initialStateFromLocalStorage<UsedCellData | null>({ key: 'lostCell', defaultValue: null, crosswordIndex })
  );
  const [focusedClue, setFocusedClue] = useState<WordInput>(initialClue);
  const [focusedDirection, setFocusedDirection] = useState<Direction>('across');
  const [focusedNumber, setFocusedNumber] = useState<string>('1');
  const [guesses, setGuesses] = useState<Guesses>(
    initialStateFromLocalStorage<Guesses>({
      key: 'guesses',
      defaultValue: generateInitialGuessState(crosswordData),
      crosswordIndex
    })
  );
  const [shareHistory, setShareHistory] = useState<CellColors[]>(
    initialStateFromLocalStorage<CellColors[]>({ key: 'shareHistory', defaultValue: [], crosswordIndex })
  );

  // When a new crossword is available and the crosswordRef is loaded reset the crossword game state
  useEffect(() => {
    if (resetCrossword && crosswordRef.current) {
      setResetCrossword(false);
      crosswordRef.current.reset();
    }
  }, [resetCrossword, crosswordRef])

  // When changes occur save to local storage
  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, crosswordIndex, shareHistory, isGameWon, lostCell })
  }, [guesses, shareHistory, isGameWon, lostCell])

  // Key event callbacks
  const onChar = (value: string) => {
    const guessesForWord = guesses[focusedDirection][focusedNumber];

    if (currentGuess.length < currentWord.length && guessesForWord.length < 6) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  }

  const onDelete = () => setCurrentGuess(currentGuess.slice(0, -1));

  // Callbacks to keep move history in sync with guesses
  const updateShareHistory = useCallback((guess: string) => {
    const { row, col, answer } = focusedClue;
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

    setShareHistory([...shareHistory, newCellColors])
  }, [shareHistory, focusedClue, focusedDirection]);

  const updateShareHistoryWithLoss = useCallback((cell: UsedCellData) => {
    const previousCellColors = shareHistory.slice(-1)[0] || {};
    const key = `${cell.row}_${cell.col}`;

    setShareHistory([...shareHistory, { ...previousCellColors, [key]: WORDLE_LOSE_COLOR }]);
  }, [shareHistory])

  const addGuess = (guess: string) => {
    trackGuess(crosswordIndex, guess);
    const guessesForWord = guesses[focusedDirection][focusedNumber];
    setGuesses({
      ...guesses,
      [focusedDirection]: {
        ...guesses[focusedDirection],
        [focusedNumber]: [...guessesForWord, guess]
      }
    });

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
          setLostCell(cell);
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
      setIsGameWon(true);
      setIsShareModalOpen(true);
    }
  };

  const onEnter = () => {
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
    trackGameProgress(crosswordIndex, gameProgress(gridData).toString());
    setKnownLetters(knownLetters);
  };

  const onMoved = (cell: CellData, direction: Direction, knownLetters: (string | undefined)[]) => {
    if (!cell.used) return;

    const number = cell[direction] || '';
    const wordData = crosswordData[direction][number];
    setCurrentWord(wordData.answer);
    setCurrentGuess('');
    setFocusedClue(wordData);
    setFocusedNumber(number)
    setFocusedDirection(direction);
    setKnownLetters(knownLetters);
  };

  return (
    <div className='flex flex-col h-screen'>
      {crosswordIndex === 14 && <div className='flex justify-center items-center w-screen bg-yellow-400 text-md p-1 text-center'>
        <p>Realized the crosswordle today had a lot of luck involved so I updated it. Play the original <a href="?index=13" className='text-white'>here</a>.</p>
      </div>}
      <div className="flex w-screen mx-auto items-center border-b-slate-400 border-b-[1px] p-4 md:p-6">
        <h1 className="text-xl grow font-bold">Crosswordle {crosswordIndex + 1}</h1>
        <ToastContainer />
        <PresentationChartBarIcon
          className="h-6 w-6 mr-5 cursor-pointer"
          onClick={() => setIsShareModalOpen(true)}
        />
        <ShareModal
          data={crosswordData}
          isOpen={isShareModalOpen}
          isGameWon={isGameWon}
          isGameLost={Boolean(lostCell)}
          handleClose={() => setIsShareModalOpen(false)}
          guesses={guesses}
          crosswordleIndex={crosswordIndex}
          shareHistory={shareHistory}
        />
        <InformationCircleIcon
          className="h-6 w-6 mr-5 cursor-pointer  md:hidden lg:hidden"
          onClick={() => setIsAboutModalOpen(true)}
        />
        <AboutModal
          isOpen={isAboutModalOpen}
          handleClose={() => setIsAboutModalOpen(false)}
        />
        <QuestionMarkCircleIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsHelpModalOpen(true)}
        />
        <HelpModal
          isOpen={isHelpModalOpen}
          handleClose={() => setIsHelpModalOpen(false)}
        />
      </div>
      <div className='flex flex-1 flex-col w-screen overflow-x-hidden md:flex-row lg:flex-row'>
        <div className='w-full flex justify-center items-center border-slate-400 p-4 px-20 md:p-6 md:w-1/2 md:border-r' >
          <div className='max-w-[500px] w-full h-full flex items-center max-width-static-mobile'>
            <MyCrossword crosswordIndex={crosswordIndex} data={crosswordData} onMoved={onMoved} onChange={onGridDataChange} ref={crosswordRef} />
          </div>
        </div>
        <div className='w-full flex flex-1 md:items-center md:w-1/2'>
          <div className="md:py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 keyboard">
            <Grid guesses={guesses[focusedDirection][focusedNumber] || []} currentGuess={currentGuess} knownLetters={knownLetters} solution={currentWord}/>
            <Keyboard
              solution={currentWord}
              knownChars={knownLetters.filter(notEmpty)}
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              guesses={guesses[focusedDirection][focusedNumber] || []}
            />
          </div>
        </div>
      </div>
      <div className="flex w-screen mx-auto items-center border-t-slate-400 border-t-[1px] p-4 md:p-6 hidden md:block lg:block">
        <button
          type="button"
          className="mx-auto flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setIsAboutModalOpen(true)}
        >
          About this game
        </button>
      </div>
    </div>
  )
}

export default App;
