import { InformationCircleIcon, PresentationChartBarIcon } from '@heroicons/react/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from './components/alerts/Alert';
import { Grid } from './components/grid/Grid';
import { Keyboard } from './components/keyboard/Keyboard';
import { AboutModal } from './components/modals/AboutModal';
import { InfoModal } from './components/modals/InfoModal';
import { ShareModal } from './components/modals/ShareModal';
import { isWordInWordList } from './lib/words';
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  StoredGameState,
} from './lib/localStorage';
import Crossword, { CrosswordImperative } from 'react-crossword-v2';
import './App.css';
import { Direction, ClueTypeOriginal, CluesInputOriginal, UsedCellData, GridData } from 'react-crossword-v2/dist/types';
import { notEmpty } from './lib/utils';
import { crosswordIndex, crossword as crosswordData } from './lib/utils';
import { CellColors } from './components/mini-crossword/MiniCrossword';
import { WORDLE_CORRECT_COLOR, WORDLE_MISPLACED_COLOR, WORDLE_WRONG_COLOR } from './constants/colors';

type Guesses = StoredGameState['guesses'];

const initialClue = crosswordData['across']['1'];

const generateInitialGuessState = (data: CluesInputOriginal[Direction]) => {
  return Object.keys(data).reduce((guessData, num) => {
    guessData[num] = [];
    return guessData;
  }, {} as Guesses[string])
};

function App() {
  const crosswordRef = useRef<CrosswordImperative>(null);
  const [gridData, setGridData] = useState<GridData | null>(null);
  const [knownLetters, setKnownLetters] = useState<(string | undefined)[]>([]);
  const [resetCrossword, setResetCrossword] = useState(false);
  const [checkGameState, setCheckGameState] = useState(false);
  const [checkKnownLetters, setCheckKnownLetters] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentWord, setCurrentWord] = useState(initialClue.answer);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [lostCell, setLostCell] = useState<UsedCellData | null>(null);
  const [focusedClue, setFocusedClue] = useState<ClueTypeOriginal>(initialClue);
  const [focusedDirection, setFocusedDirection] = useState<Direction>('across');
  const [focusedNumber, setFocusedNumber] = useState<string>('1');
  const [shareComplete, setShareComplete] = useState(false)
  const [guesses, setGuesses] = useState<Guesses>(
    () => {
      const loaded = loadGameStateFromLocalStorage();
      if (!loaded || loaded.crosswordIndex !== crosswordIndex) {
        setResetCrossword(true);
        return {
          across: generateInitialGuessState(crosswordData.across),
          down: generateInitialGuessState(crosswordData.down),
        };
      }
      return loaded.guesses;
    }
  );
  const [shareHistory, setShareHistory] = useState<CellColors[]>(
    () => {
      const loaded = loadGameStateFromLocalStorage();
      if (!loaded || loaded.crosswordIndex !== crosswordIndex) {
        return [];
      }
      return loaded.shareHistory;
    }
  );

  useEffect(() => {
    if (resetCrossword && crosswordRef.current) {
      setResetCrossword(false);
      crosswordRef.current.reset();
    }
  }, [resetCrossword, crosswordRef])

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, crosswordIndex, shareHistory })
  }, [guesses, shareHistory])

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

  const updateShareHistory = (guess: string) => {
    const { row, col, answer } = focusedClue;
    const previousCellColors = shareHistory.slice(-1)[0] || {};
    const newCellColors = { ...previousCellColors };
    const onlyGreenCellColors = { ...previousCellColors };

    guess.split('').forEach((letter, index) => {
      const newRow = row + (focusedDirection === 'across' ? 0 : index);
      const newCol = col + (focusedDirection === 'across' ? index : 0);

      if (newCellColors[`${newRow}_${newCol}`] === WORDLE_CORRECT_COLOR) return;

      if (letter === answer[index]) {
        newCellColors[`${newRow}_${newCol}`] = WORDLE_CORRECT_COLOR;
        onlyGreenCellColors[`${newRow}_${newCol}`] = WORDLE_CORRECT_COLOR;
      } else if (answer.includes(letter)) {
        newCellColors[`${newRow}_${newCol}`] = WORDLE_MISPLACED_COLOR;
      } else {
        newCellColors[`${newRow}_${newCol}`] = WORDLE_WRONG_COLOR;
      }
    });

    setShareHistory([...shareHistory, newCellColors, onlyGreenCellColors])
  };

  const addGuess = (guess: string) => {
    const guessesForWord = guesses[focusedDirection][focusedNumber];
    setGuesses({
      ...guesses,
      [focusedDirection]: {
        ...guesses[focusedDirection],
        [focusedNumber]: [...guessesForWord, guess]
      }
    });
    updateShareHistory(guess);
  };

  const checkCrosswordCorrect = useCallback(() => {
    const data = crosswordRef.current?.getData();
    if (!data || data.gridData.length === 0) return;

    const crosswordCorrect = data.gridData.every((row) => {
      return row.every((col) => !col.used || col.guess === col.answer);
    });

    // Used for share
    if (!gridData) setGridData(data.gridData);
    setIsGameWon(crosswordCorrect);
  }, [setIsGameWon, crosswordRef, gridData]);

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

  const checkCrosswordLoss = useCallback(() => {
    const data = crosswordRef.current?.getData();
    if (!data) return;

    data.gridData.forEach((row) => {
      row.forEach((cell) => {
        if (cell.used && isCellLost(cell)) setLostCell(cell);
      });
    });
  }, [crosswordRef, setLostCell, isCellLost]);

  const onEnter = () => {
    if (!isWordInWordList(currentGuess) && currentGuess !== currentWord) {
      setIsWordNotFoundAlertOpen(true)
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false)
      }, 2000)
    }

    const { row, col } = focusedClue;
    const guessesForWord = guesses[focusedDirection][focusedNumber];

    if (currentGuess.length === currentWord.length && guessesForWord.length < 6) {
      addGuess(currentGuess)
      setCurrentGuess('');
      
      if (focusedClue) {
        Array.from(currentGuess).forEach((letter, index) => {
          if (!crosswordRef.current) return;
          if (currentWord[index] !== letter) return;

          let rowToUpdate = row;
          let colToUpdate = col;

          if (focusedDirection === 'across') {
            colToUpdate += index;
          } else {
            rowToUpdate += index
          }

          crosswordRef.current.setGuess(rowToUpdate, colToUpdate, letter);
        });
      }
    }

    setTimeout(() => {
      setCheckKnownLetters(true);
      setCheckGameState(true);
    }, 0);
  };

  useEffect(() => {
    if (checkGameState) {
      setCheckGameState(false);
      checkCrosswordCorrect();
      checkCrosswordLoss();
    }
  }, [checkGameState, checkCrosswordCorrect, checkCrosswordLoss]);

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
      setCheckGameState(true);
    }
  }, [crosswordRef])

  useEffect(() => setIsShareModalOpen(isGameWon), [isGameWon]);

  const updateKnownLetters = (direction: Direction, wordData: ClueTypeOriginal) => {
    const newKnownLetters = Array.from(wordData.answer).map((_, index) => {
      if (!crosswordRef.current) return undefined;

      let letterRow = wordData.row;
      let letterCol = wordData.col;

      if (direction === 'across') {
        letterCol += index;
      } else {
        letterRow += index
      }

      return crosswordRef.current.getCurrentGuess(letterRow, letterCol);
    });
    setKnownLetters(newKnownLetters);
  }

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

  let loseMessage = 'You lost! You ran out of guesses on ';
  const lostClues = []
  if (lostCell?.across) lostClues.push(`${lostCell.across} Across`);
  if (lostCell?.down) lostClues.push(`${lostCell.down} Down`);
  loseMessage += `${lostClues.join(' and ')}. Better luck next time!`;

  return (
    <div className='h-screen'>
      <div className="flex w-100 mx-auto items-center border-b-slate-400 border-b-[1px] p-10">
        <h1 className="text-xl grow font-bold">Crosswordle - {crosswordIndex + 1}</h1>
        {isGameWon && (
          <PresentationChartBarIcon
            className="h-6 w-6 mr-5 cursor-pointer"
            onClick={() => setIsShareModalOpen(true)}
          />
        )}
        <InformationCircleIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsInfoModalOpen(true)}
        />
      </div>
      <div className='flex flex-col md:flex-row lg:flex-row'>
        <div className='w-full flex justify-center items-center border-slate-400 border-b p-10 md:w-1/2 md:border-b-[0px] md:border-r'>
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
            <Alert
              message={loseMessage}
              isOpen={Boolean(lostCell)}
            />
            <Alert
              message="Crossworldle Gif downloaded share it with your friends!"
              isOpen={shareComplete}
              variant="success"
            />
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
      <div className="flex w-100 mx-auto items-center border-t-slate-400 border-t-[1px] p-10">
        <ShareModal
          isOpen={isShareModalOpen}
          handleClose={() => setIsShareModalOpen(false)}
          guesses={guesses}
          getGridData={() => crosswordRef.current?.getData()?.gridData}
          crosswordleIndex={crosswordIndex}
          shareHistory={shareHistory}
          handleShare={() => {
            setShareComplete(true)
            return setTimeout(() => {
              setShareComplete(false)
            }, 2000)
          }}
        />
        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={() => setIsInfoModalOpen(false)}
        />
        <AboutModal
          isOpen={isAboutModalOpen}
          handleClose={() => setIsAboutModalOpen(false)}
        />
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

export default App
