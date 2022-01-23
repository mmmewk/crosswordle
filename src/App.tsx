import { InformationCircleIcon } from '@heroicons/react/outline';
import { useRef, useState } from 'react';
import { Alert } from './components/alerts/Alert';
import { Grid } from './components/grid/Grid';
import { Keyboard } from './components/keyboard/Keyboard';
import { AboutModal } from './components/modals/AboutModal';
import { InfoModal } from './components/modals/InfoModal';
// import { WinModal } from './components/modals/WinModal';
import { isWordInWordList } from './lib/words';
// import {
//   loadGameStateFromLocalStorage,
//   saveGameStateToLocalStorage,
// } from './lib/localStorage';
import Crossword, { CrosswordImperative } from 'react-crossword-v2';
import './App.css';
import crosswords from './constants/crosswords';
import { Direction, CellData, ClueTypeOriginal } from 'react-crossword-v2/dist/types';

const crosswordData = crosswords[0];

function App() {
  const crosswordRef = useRef<CrosswordImperative>(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  // const [isGameWon, setIsGameWon] = useState(false)
  // const [isWinModalOpen, setIsWinModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false)
  const [focusedClue, setFocusedClue] = useState<ClueTypeOriginal>();
  const [focusedDirection, setFocusedDirection] = useState<Direction>();
  // const [shareComplete, setShareComplete] = useState(false)
  const [guesses, setGuesses] = useState<{ [word: string]: string[] }>({});
    // () => {
    //   const loaded = loadGameStateFromLocalStorage()
    //   if (loaded?.solution !== solution) {
    //     return []
    //   }
    //   if (loaded.guesses.includes(solution)) {
    //     setIsGameWon(true)
    //   }
    //   return loaded.guesses
    // }

  // useEffect(() => {
  //   saveGameStateToLocalStorage({ guesses, solution })
  // }, [guesses])

  // useEffect(() => {
  //   if (isGameWon) {
  //     setIsWinModalOpen(true)
  //   }
  // }, [isGameWon])

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
      }

      if (guessesForWord.length === 5) {
        setIsGameLost(true)
        return setTimeout(() => {
          setIsGameLost(false)
        }, 2000)
      }
    }
  };

  const onMoved = (direction: Direction, row: number, col: number, cellData: CellData | undefined) => {
    if (cellData?.used && cellData[direction]) {
      const number = cellData[direction] || '';
      const wordData = crosswordData[direction][number];
      if (!guesses[wordData.answer]) setGuesses({ ...guesses, [wordData.answer]: [] });
      setCurrentWord(wordData.answer);
      setCurrentGuess('');
      setFocusedClue(wordData);
      setFocusedDirection(direction);
    }
  }

  return (
    <div className='flex h-screen'>
      <div className='w-1/2 flex justify-center items-center border-r-slate-400 border-r-[1px] p-10'>
        <Crossword
          ref={crosswordRef}
          data={crosswordData}
          useStorage={false}
          onMoved={onMoved}
        />
      </div>
      <div className='w-1/2 flex justify-center items-center'>
        <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Alert message="Word not found" isOpen={isWordNotFoundAlertOpen} />
          <Alert
            message={`You lost, the word was ${currentWord}`}
            isOpen={isGameLost}
          />
          {/* <Alert
            message="Game copied to clipboard"
            isOpen={shareComplete}
            variant="success"
          /> */}
          <div className="flex w-80 mx-auto items-center mb-8">
            <h1 className="text-xl grow font-bold">Crosswordle</h1>
            <InformationCircleIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => setIsInfoModalOpen(true)}
            />
          </div>
          <Grid guesses={guesses[currentWord] || []} currentGuess={currentGuess} solution={currentWord}/>
          <Keyboard
            solution={currentWord}
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            guesses={guesses[currentWord] || []}
          />
          {/* <WinModal
            isOpen={isWinModalOpen}
            handleClose={() => setIsWinModalOpen(false)}
            guesses={guesses}
            handleShare={() => {
              setIsWinModalOpen(false)
              setShareComplete(true)
              return setTimeout(() => {
                setShareComplete(false)
              }, 2000)
            }}
          /> */}
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
