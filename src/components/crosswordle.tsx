import { QuestionMarkCircleIcon, PresentationChartBarIcon, CogIcon, PencilIcon, ArchiveIcon, MenuIcon } from '@heroicons/react/outline';
import { ElementRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid } from './grid/Grid';
import { Keyboard } from './keyboard/Keyboard';
import { HelpModal } from './modals/HelpModal';
import { ShareModal } from './modals/ShareModal';
import { useLazyLoadedValidWords } from '../lib/words';
import '../App.scss';
import { formatTime, getInitialClue, getTotalGuesses } from '../lib/utils';
import { CellColors } from './mini-crossword/MiniCrossword';
import { WORDLE_CORRECT_COLOR, WORDLE_LOSE_COLOR, WORDLE_MISPLACED_COLOR, WORDLE_WRONG_COLOR } from '../constants/colors';
import { Crossword } from './crossword/Crossword';
import { CellData, Direction, GridData, UsedCellData, WordInput } from '../types';
import { trackGameEnd, trackGuess } from '../lib/analytics';
import { useGameState } from '../redux/hooks/useGameState';
import { SubmitModal } from './modals/SubmitModal';
import { otherDirection } from '../lib/crossword-utils';
import { SettingsModal } from './modals/SettingsModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setPencilMode } from '../redux/slices/settingsSlice';
import { markFirstRender, setOpenModal } from '../redux/slices/navigationSlice';
import { useStats } from '../redux/hooks/useStats';
import { updateStreakWithLoss, updateStreakWithWin } from '../redux/slices/statsSlice';
import crosswords from '../constants/crosswords';
import { crosswordIndex as defaultIndex } from '../lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { TimerHelpModal } from './modals/TimerHelpModal';
import { incrementTimer, startTimer } from '../redux/slices/wordleSlice';
import { useInterval } from '../lib/useInterval';
import cn from 'classnames';
import { useWindowListener } from '../lib/useWindowListener';
import { Modal } from './modals/Modal';

type crosswordleParams = {
  crosswordNumber?: string;
}

const Crosswordle : React.FC = () => {
  const navigate = useNavigate();
  const firstRender = useSelector((state: RootState) => state.navigation.firstRender);
  const { crosswordNumber } = useParams<crosswordleParams>();
  const crosswordIndex = crosswordNumber ? (Number(crosswordNumber) - 1) : defaultIndex;
  const crosswordData = crosswords[crosswordIndex];
  const { initialClue, initialDirection } = useMemo(() => getInitialClue(crosswordData), [crosswordData]);
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
    time,
  } = useGameState(crosswordIndex);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentWord, setCurrentWord] = useState(initialClue.answer);
  const [crossedWord, setCrossedWord] = useState<string | undefined>();
  const [focusedWordData, setFocusedWordData] = useState<WordInput>(initialClue);
  const [focusedDirection, setFocusedDirection] = useState<Direction>(initialDirection);
  const [focusedNumber, setFocusedNumber] = useState<string>('1');
  const [crossedNumber, setCrossedNumber] = useState<string | undefined>(undefined);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [crossedFocusedIndex, setCrossedFocusedIndex] = useState<number | undefined>(undefined);
  const [validWords, loadValidWords] = useLazyLoadedValidWords();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { darkMode, pencilMode, showTimer } = useSelector((state: RootState) => state.settings);
  const { totalGames } = useStats();

  // Open help modal if they have never completed a game
  useEffect(() => {
    if (firstRender && (totalGames === 0)) dispatch(setOpenModal('help'));
  }, [totalGames, dispatch, firstRender]);

  // Open share modal if they have already finished this game
  useEffect(() => {
    if (isGameWon || lostCell) dispatch(setOpenModal('share'));
  }, [isGameWon, lostCell, dispatch, firstRender]);

  useEffect(() => {
    dispatch(markFirstRender());
  }, [dispatch, firstRender]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    loadValidWords();
  }, [loadValidWords]);

  useWindowListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Shift') togglePencilMode();
  });

  // After keyboard input move to the next square where you can type
  const moveToIndex = useCallback((index: number) => {
    let { row, col } = focusedWordData;
    if (focusedDirection === 'across') col += index;
    if (focusedDirection === 'down') row += index;
    crosswordRef.current?.moveTo(row, col);
  }, [focusedDirection, crosswordRef, focusedWordData]);

  // Key event callbacks
  const onChar = (value: string) => {
    if (pencilMode) {
      crosswordRef.current?.pencilLetter(value);
      moveToIndex(focusedIndex + 1);
      return;
    }

    const guessesForWord = guesses[focusedDirection][focusedNumber];

    if (currentGuess.length < currentWord.length && guessesForWord.length < 6) {
      const newGuess = `${currentGuess}${value}`;
      setCurrentGuess(newGuess);
      moveToIndex(newGuess.length);
    }
  }

  const onDelete = () => {
    if (pencilMode) {
      crosswordRef.current?.eraseLetter();
      moveToIndex(focusedIndex - 1);
      return;
    }

    const newGuess = currentGuess.slice(0, -1);
    setCurrentGuess(newGuess);
    moveToIndex(newGuess.length);  
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
    if (shareHistory.length === 0) dispatch(startTimer({ index: crosswordIndex }));
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
    let crosswordCorrect = true;

    gridData.forEach((row) => {
      return row.forEach((cell) => {
        if (!cell.used) return;
        if (isCellLost(cell)) {
          gameLost = true;
          lose(cell);
          updateShareHistoryWithLoss(cell);
        }
        if (crosswordCorrect) crosswordCorrect = cell.guess === cell.answer;
      });
    });

    const totalGuesses = getTotalGuesses(guesses);

    if (gameLost) {
      trackGameEnd(crosswordIndex, 'game_lost', totalGuesses);
      dispatch(updateStreakWithLoss(crosswordIndex));
      crosswordRef?.current?.reveal();
    }

    if (crosswordCorrect) {
      trackGameEnd(crosswordIndex, 'game_won', totalGuesses);
      dispatch(updateStreakWithWin(crosswordIndex));
      win();
    }
  };

  const onEnter = async () => {
    if (currentGuess.length !== currentWord.length) return;
    const allowedWords = validWords || await loadValidWords();

    const wordAllowed = allowedWords.includes(currentGuess.toLowerCase());

    // Alert user if guess is not a word
    if (!wordAllowed && currentGuess !== currentWord) {
      toast.error('Word not found');
      return;
    }

    const guessesForWord = guesses[focusedDirection][focusedNumber];

    if (currentGuess.length === currentWord.length && guessesForWord.length < 6 && !guessesForWord.includes(currentGuess)) {
      addGuess(currentGuess)
      setCurrentGuess('');
    }
  };

  const onGridDataChange = (gridData: GridData) => {
    checkWinOrLoss(gridData);
  };

  const onMoved = (cell: CellData, direction: Direction) => {
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
    setFocusedIndex(cell.row - wordData.row || cell.col - wordData.col);
    setCrossedFocusedIndex(crossedWordData ? cell.row - crossedWordData.row || cell.col - crossedWordData.col : undefined);
  };

  useEffect(() => {
    setCurrentGuess('');
  }, [focusedDirection, focusedNumber]);
  
  const togglePencilMode = () => {
    const enabled = !pencilMode;
    dispatch(setPencilMode(enabled));
    setCurrentGuess('');
  };

  useInterval(() => {
    if (time !== undefined && !isGameWon && !lostCell) {
      dispatch(incrementTimer({ index: crosswordIndex }));
    }
  }, 1000);

  useEffect(() => {
    // Correction toast specifically for crosswordle 104
    if (crosswordIndex === 103) dispatch(setOpenModal('notice'));
  }, [crosswordIndex, dispatch]);

  // Prevent user from accessing puzzles that haven't yet been released
  if (defaultIndex < crosswordIndex) return <NotFound />

  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex w-screen mx-auto items-center border-b-slate-400 border-b-[1px] p-3 md:p-4">
        <div className='grow'>
          <h1 className="text-md md:text-xl font-bold whitespace-nowrap dark:text-white">Crosswordle {crosswordIndex + 1}</h1>
          <p className="text-sm text-slate-400">By {crosswordData.author || 'Matthew Koppe'}</p>
        </div>
        {showTimer && <p className="text-sm text-slate-400">{formatTime(time)}</p>}
        <PencilIcon
          className="h-6 w-6 ml-3 mr-3 cursor-pointer dark:stroke-white"
          fill={pencilMode ? 'rgb(250, 200, 23)' : darkMode ? 'transparent' : 'white'}
          onClick={togglePencilMode}
        />
        <MenuIcon
          className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white md:hidden"
          onClick={() => setShowMenu(!showMenu)}
        />
        <PresentationChartBarIcon
          className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white hidden md:inline"
          onClick={() => dispatch(setOpenModal('share'))}
        />
        <ArchiveIcon
          className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white hidden md:inline"
          onClick={() => navigate('/puzzles')}
        />
        <QuestionMarkCircleIcon
          className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white hidden md:inline"
          onClick={() => dispatch(setOpenModal('help'))}
        />
        <CogIcon
          className="h-6 w-6 cursor-pointer dark:stroke-white hidden md:inline"
          onClick={() => dispatch(setOpenModal('settings'))}
        />
        <div className={cn('menu md:hidden', { 'hidden': !showMenu })}>
          <div
            className="mb-2 mx-2 cursor-pointer flex items-center"
            onClick={() => {
              dispatch(setOpenModal('share'))
              setShowMenu(false);
            }}
          >
            <PresentationChartBarIcon className='h-4 w-4 mr-2'/>Share
          </div>
          <div
            className="mb-2 mx-2 cursor-pointer flex items-center"
            onClick={() => {
              navigate('/puzzles')
              setShowMenu(false);
            }}
          >
            <ArchiveIcon className='h-4 w-4 mr-2'/>Puzzle Archive
          </div>
          <div
            className="mb-2 mx-2 cursor-pointer flex items-center"
            onClick={() => {
              dispatch(setOpenModal('help'))
              setShowMenu(false);
            }}
          >
            <QuestionMarkCircleIcon className='h-4 w-4 mr-2'/>How to Play
          </div>
          <div
            className="mb-2 mx-2 cursor-pointer flex items-center"
            onClick={() => {
              dispatch(setOpenModal('settings'))
              setShowMenu(false);
            }}
          >
            <CogIcon className='h-4 w-4 mr-2'/>Settings
          </div>
        </div>
        <ShareModal crosswordIndex={crosswordIndex} />
        <HelpModal />
        <HelpModal onlyKeyboard={true} />
        <SettingsModal />
        <SubmitModal />
        <TimerHelpModal />
        <Modal name='notice' title="Updates to today's puzzle">
          <p className='text-gray-400'>
            Today's puzzle originally had a typo "ONIOM" instead of "ONION".
            If you had previously started this puzzle I have reset it, if you still see the word "ONIOM" in the puzzle try refreshing the page.
            If you previously lost this puzzle I reset your streak so you won't lose your streak.
            Sorry for the typo!
          </p>
        </Modal>
      </div>
      <div className='flex flex-1 flex-col w-screen overflow-x-hidden md:flex-row lg:flex-row'>
        <div className='w-full flex md:items-center justify-center px-20 md:p-6 md:w-1/2' >
          <div className='max-w-[300px] md:max-w-[500px] w-full h-full justify-center max-width-static-mobile'>
            <Crossword crosswordIndex={crosswordIndex} onMoved={onMoved} onChange={onGridDataChange} ref={crosswordRef} guess={currentGuess} />
          </div>
        </div>
        <div className='w-full flex flex-1 md:items-center md:w-1/2 md:border-l border-slate-400'>
          <div className="md:py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 keyboard">
            <Grid
              guesses={guesses[focusedDirection][focusedNumber] || []}
              currentGuess={currentGuess}
              solution={currentWord}
              focusedIndex={focusedIndex}
            />
            <Keyboard
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              solution={currentWord}
              crossedSolution={crossedWord}
              guesses={guesses[focusedDirection][focusedNumber] || []}
              crossedGuesses={guesses[otherDirection(focusedDirection)][crossedNumber || 0] || []}
              index={focusedIndex}
              crossedIndex={crossedFocusedIndex}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Crosswordle;
