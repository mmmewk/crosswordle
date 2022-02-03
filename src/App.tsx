import { InformationCircleIcon, QuestionMarkCircleIcon, PresentationChartBarIcon } from '@heroicons/react/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from './components/alerts/Alert';
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
import Crossword, { CrosswordImperative } from 'react-crossword-v2';
import './App.css';
import { Direction, ClueTypeOriginal, UsedCellData } from 'react-crossword-v2/dist/types';
import { notEmpty } from './lib/utils';
import { crosswordIndex, crossword as crosswordData } from './lib/utils';
import { CellColors } from './components/mini-crossword/MiniCrossword';
import { WORDLE_CORRECT_COLOR, WORDLE_LOSE_COLOR, WORDLE_MISPLACED_COLOR, WORDLE_WRONG_COLOR } from './constants/colors';

const initialClue = crosswordData['across']['1'];

function App() {
  const crosswordRef = useRef<CrosswordImperative>(null);
  const [knownLetters, setKnownLetters] = useState<(string | undefined)[]>([]);
  const [resetCrossword, setResetCrossword] = useState(() => {
    const loaded = loadGameStateFromLocalStorage();
    return !loaded || loaded.crosswordIndex !== crosswordIndex;
  });
  const [checkGameState, setCheckGameState] = useState(false);
  const [checkKnownLetters, setCheckKnownLetters] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentWord, setCurrentWord] = useState(initialClue.answer);
  const [isShareModalOpen, setIsShareModalOpen] = useState(() => {
    const loaded = loadGameStateFromLocalStorage();
    if (!loaded || loaded.crosswordIndex !== crosswordIndex) return false;
    return Boolean(loaded.lostCell) || loaded.isGameWon;
  });
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(
    initialStateFromLocalStorage<boolean>({ key: 'isGameWon', defaultValue: false, crosswordIndex })
  );
  const [lostCell, setLostCell] = useState<UsedCellData | null>(
    initialStateFromLocalStorage<UsedCellData | null>({ key: 'lostCell', defaultValue: null, crosswordIndex })
  );
  const [focusedClue, setFocusedClue] = useState<ClueTypeOriginal>(initialClue);
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
    const lastGuess = guesses[focusedDirection][focusedNumber].slice(-1)[0];
    const guessesForWord = guesses[focusedDirection][focusedNumber];

    if (currentGuess.length < currentWord.length && guessesForWord.length < 6 && lastGuess !== currentWord) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  }

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
    const guessesForWord = guesses[focusedDirection][focusedNumber];
    setGuesses({
      ...guesses,
      [focusedDirection]: {
        ...guesses[focusedDirection],
        [focusedNumber]: [...guessesForWord, guess]
      }
    });
    
    // Add guess to crossword
    Array.from(currentGuess).forEach((letter, index) => {
      if (!crosswordRef.current) return;
      if (currentWord[index] !== letter) return;

      let rowToUpdate = focusedClue.row;
      let colToUpdate = focusedClue.col;

      if (focusedDirection === 'across') {
        colToUpdate += index;
      } else {
        rowToUpdate += index
      }

      crosswordRef.current.setGuess(rowToUpdate, colToUpdate, letter);
    });

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
  }, [guesses])

  const checkWinOrLoss = useCallback(() => {
    const gridData = crosswordRef.current?.getGridData();
    if (!gridData || gridData.length === 0 || isGameWon || lostCell) return;

    const crosswordCorrect = gridData.every((row) => {
      return row.every((cell) => {
        if (!cell.used) return true;
        if (isCellLost(cell)) {
          setLostCell(cell);
          updateShareHistoryWithLoss(cell);
          setIsAboutModalOpen(true);
          return false;
        }
        return cell.guess === cell.answer;
      });
    });

    if (crosswordCorrect) {
      setIsGameWon(true);
      setIsShareModalOpen(true);
    }
  }, [setIsGameWon, crosswordRef, isGameWon, lostCell, isCellLost, updateShareHistoryWithLoss]);

  const onEnter = () => {
    // Alert user if guess is not a word
    if (!isWordInWordList(currentGuess) && currentGuess !== currentWord) {
      setIsWordNotFoundAlertOpen(true)
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false)
      }, 2000);
    }

    const guessesForWord = guesses[focusedDirection][focusedNumber];

    if (currentGuess.length === currentWord.length && guessesForWord.length < 6) {
      addGuess(currentGuess)
      setCurrentGuess('');
    }

    setCheckKnownLetters(true);
    setCheckGameState(true);
  };

  // Effects to update game state after crossword data has been input
  useEffect(() => {
    if (checkGameState) {
      setCheckGameState(false);
      checkWinOrLoss();
    }
  }, [checkGameState, checkWinOrLoss]);

  useEffect(() => {
    if (checkKnownLetters) {
      updateKnownLetters(focusedDirection, focusedClue);
      setCheckKnownLetters(false);
    }
  }, [checkKnownLetters, focusedDirection, focusedClue]);

  useEffect(() => {
    if (crosswordRef.current) {
      crosswordRef.current.focus();
      crosswordRef.current.moveTo(initialClue.row, initialClue.col, 'across');
      setCheckKnownLetters(true);
    }
  }, [crosswordRef])

  const updateKnownLetters = (direction: Direction, wordData: ClueTypeOriginal) => {
    const newKnownLetters = Array.from(wordData.answer).map((_, index) => {
      if (!crosswordRef.current) return undefined;

      let letterRow = wordData.row + (direction === 'across' ? 0 : index);
      let letterCol = wordData.col + (direction === 'across' ? index : 0);

      return crosswordRef.current.getCurrentGuess(letterRow, letterCol);
    });
    setKnownLetters(newKnownLetters);
  }

  // When highlighted word on the crossword changes sync state to the crosswordle
  const onMoved = (direction: Direction, row: number, col: number) => {
    if (!crosswordRef.current) return;

    const cellData = crosswordRef.current.getCellData(row, col);

    if (cellData?.used && cellData[direction]) {
      const number = cellData[direction] || '';
      const wordData = crosswordData[direction][number];
      setCurrentWord(wordData.answer);
      setCurrentGuess('');
      setFocusedClue(wordData);
      setFocusedNumber(number)
      setFocusedDirection(direction);
      setCheckKnownLetters(true);
    }
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className="flex w-screen mx-auto items-center border-b-slate-400 border-b-[1px] p-4 md:p-6">
        <h1 className="text-xl grow font-bold">Crosswordle - {crosswordIndex + 1}</h1>
        <PresentationChartBarIcon
          className="h-6 w-6 mr-5 cursor-pointer"
          onClick={() => setIsShareModalOpen(true)}
        />
        <ShareModal
          isOpen={isShareModalOpen}
          isGameWon={isGameWon}
          isGameLost={Boolean(lostCell)}
          handleClose={() => setIsShareModalOpen(false)}
          guesses={guesses}
          getGridData={() => crosswordRef.current?.getGridData()}
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
      <div className='flex flex-col w-screen overflow-x-hidden md:flex-row lg:flex-row flex-1'>
        <div className='w-full flex justify-center items-center border-slate-400 border-b p-4 md:p-6 md:w-1/2 md:border-b-[0px] md:border-r'>
          <div className='max-w-[500px] w-full h-full flex items-center'>
            <Crossword
              ref={crosswordRef}
              data={crosswordData}
              onMoved={onMoved}
            />
          </div>
        </div>
        <div className='w-full flex justify-center items-center md:w-1/2'>
          <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Alert message="Word not found" isOpen={isWordNotFoundAlertOpen} />
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
