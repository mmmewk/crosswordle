import { InformationCircleIcon } from '@heroicons/react/outline';
import { useEffect, useRef, useState } from 'react';
import { Alert } from './components/alerts/Alert';
import { Grid } from './components/grid/Grid';
import { Keyboard } from './components/keyboard/Keyboard';
import { AboutModal } from './components/modals/AboutModal';
import { InfoModal } from './components/modals/InfoModal';
import { WinModal } from './components/modals/WinModal';
import { isWordInWordList } from './lib/words';
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from './lib/localStorage';
import Crossword, { CrosswordImperative } from 'react-crossword-v2';
import './App.css';
import { Direction, CellData, ClueTypeOriginal } from 'react-crossword-v2/dist/types';
import { notEmpty } from './lib/utils';
import { crosswordIndex, crossword as crosswordData } from './lib/utils';

const intialClue = crosswordData['across']['1'];

function App() {
  const crosswordRef = useRef<CrosswordImperative>(null);
  const [knownLetters, setKnownLetters] = useState<(string | undefined)[]>([]);
  const [resetCrossword, setResetCrossword] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentWord, setCurrentWord] = useState(intialClue.answer);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false);
  // const [isGameLost, setIsGameLost] = useState(false)
  const [focusedClue, setFocusedClue] = useState<ClueTypeOriginal>(intialClue);
  const [focusedDirection, setFocusedDirection] = useState<Direction>('across');
  // const [shareComplete, setShareComplete] = useState(false)
  const [guesses, setGuesses] = useState<{ [word: string]: string[] }>(
    () => {
      const loaded = loadGameStateFromLocalStorage();
      if (!loaded || loaded.crosswordIndex !== crosswordIndex) {
        setResetCrossword(true);
        return {};
      }
      return loaded.guesses
    }
  );

  useEffect(() => {
    if (resetCrossword && crosswordRef.current) {
      setResetCrossword(false);
      crosswordRef.current.reset();
    }
  }, [resetCrossword, crosswordRef])

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, crosswordIndex })
  }, [guesses])

  const onChar = (value: string) => {
    if (currentGuess.length < currentWord.length && guesses[currentWord].length < 6) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  }

  const onEnter = () => {
    const guessesForWord = guesses[currentWord];

    if (!isWordInWordList(currentGuess) && currentGuess !== currentWord) {
      setIsWordNotFoundAlertOpen(true)
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false)
      }, 2000)
    }

    if (currentGuess.length === currentWord.length && guessesForWord.length < 6) {
      setGuesses({ ...guesses, [currentWord]: [...guessesForWord, currentGuess] });
      setCurrentGuess('');
      
      if (focusedClue) {
        const { row, col } = focusedClue;

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

        setTimeout(() => {
          updateKnownLetters(focusedDirection, focusedClue);
        }, 0);
      }

      if (crosswordRef.current?.isCrosswordCorrect()) setIsWinModalOpen(true);
    }
  };

  useEffect(() => {
    if (crosswordRef.current) crosswordRef.current.focus();
  }, [crosswordRef])

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

  const onMoved = (direction: Direction, row: number, col: number, cellData: CellData | undefined) => {
    if (cellData?.used && cellData[direction]) {
      const number = cellData[direction] || '';
      const wordData = crosswordData[direction][number];
      if (!guesses[wordData.answer]) setGuesses({ ...guesses, [wordData.answer]: [] });
      setCurrentWord(wordData.answer);
      setCurrentGuess('');
      setFocusedClue(wordData);
      setFocusedDirection(direction);
      updateKnownLetters(direction, wordData);
    }
  }

  return (
    <div className='flex h-screen'>
      <div className='w-1/2 flex justify-center items-center border-r-slate-400 border-r-[1px] p-10'>
        <Crossword
          ref={crosswordRef}
          data={crosswordData}
          onMoved={onMoved}
        />
      </div>
      <div className='w-1/2 flex justify-center items-center'>
        <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Alert message="Word not found" isOpen={isWordNotFoundAlertOpen} />
          {/* <Alert
            message={`You lost, the word was ${currentWord}`}
            isOpen={isGameLost}
          /> */}
          {/* <Alert
            message="Game copied to clipboard"
            isOpen={shareComplete}
            variant="success"
          /> */}
          <div className="flex w-80 mx-auto items-center mb-8">
            <h1 className="text-xl grow font-bold">Crosswordle - {crosswordIndex + 1}</h1>
            <InformationCircleIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => setIsInfoModalOpen(true)}
            />
          </div>
          <Grid guesses={guesses[currentWord] || []} currentGuess={currentGuess} knownLetters={knownLetters} solution={currentWord}/>
          <Keyboard
            solution={currentWord}
            knownChars={knownLetters.filter(notEmpty)}
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            guesses={guesses[currentWord] || []}
          />
          <WinModal
            isOpen={isWinModalOpen}
            handleClose={() => setIsWinModalOpen(false)}
            guesses={guesses}
            handleShare={() => {
              setIsWinModalOpen(false)
              // setShareComplete(true)
              // return setTimeout(() => {
              //   setShareComplete(false)
              // }, 2000)
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
            className="mx-auto mt-8 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsAboutModalOpen(true)}
          >
            About this game
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
