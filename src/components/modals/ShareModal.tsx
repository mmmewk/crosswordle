import Gif from 'gif.js';
import { saveAs } from 'file-saver';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckIcon } from '@heroicons/react/outline';
import { ShareIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/outline';
import { MiniCrossword, SVG_WIDTH, SVG_HEADER_SIZE } from '../mini-crossword/MiniCrossword';
import { formatTime, getPuzzleIndexForDate, getTotalGuesses, sleep, timeTillTomorrow } from '../../lib/utils';
import { GridData } from '../../types';
import { createGridData } from '../../lib/crossword-utils';
import { trackShare } from '../../lib/analytics';
import { toast } from 'react-toastify';
import { useGameState } from '../../redux/hooks/useGameState';
import { Modal } from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setOpenModal } from '../../redux/slices/navigationSlice';
import { Stats } from './Stats';
import crosswords from '../../constants/crosswords';

const GIF_DELAY = 250;
const GIF_WIDTH = 200;
const GIF_HEIGHT = GIF_WIDTH * ((SVG_WIDTH + SVG_HEADER_SIZE) / SVG_WIDTH);

const createGifEncoder = (filename: string, onFinish?: () => void) => {
  const gifEncoder = new Gif({
    width: GIF_WIDTH,
    height: GIF_HEIGHT,
    workers: 2,
    quality: 1,
    repeat: 0,
    workerScript: '/gif.worker.js'
  })
  
  gifEncoder.on('finished', function(blob) {
    saveAs(blob, filename);
    if (onFinish) onFinish();
  });
  
  return gifEncoder;
};

type Props = {
  crosswordIndex: number;
}

export const ShareModal : React.FC<Props> = ({ crosswordIndex }) => {
  const crossword = crosswords[crosswordIndex];
  const { guesses, shareHistory, isGameWon, lostCell, time } = useGameState(crosswordIndex);
  const isGameLost = Boolean(lostCell);
  const [timeTillNext, setTimeTillNext] = useState(timeTillTomorrow);
  const [creatingGif, setCreatingGif] = useState<boolean>(false);
  const [gifEncoder, setGifEncoder] = useState<Gif>(createGifEncoder(`Crosswordle-${crosswordIndex + 1}.gif`, () => setCreatingGif(false)));
  const svgRef = useRef<SVGSVGElement>(null);
  const [cellColors, setCellColors] = useState<{ [key: string]: string }>();
  const [gridData] = useState<GridData>(createGridData(crossword));
  const totalGuesses = getTotalGuesses(guesses);
  const dispatch = useDispatch();
  const openModal = useSelector((state: RootState) => state.navigation.openModal);
  const { showTimer } = useSelector((state: RootState) => state.settings);
  const outOfPuzzles = getPuzzleIndexForDate(new Date()) === crosswords.length - 1;

  let timeText = useMemo(() => (showTimer && time) ? `${formatTime(time)} with ` : '', [time, showTimer]);

  const openSubmitModal = () => dispatch(setOpenModal('submit'));

  // Update time till next crosswordle every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTillNext(timeTillTomorrow);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (openModal === 'share') setCellColors({});
  }, [openModal]);


  const addSvgFrame = useCallback((svg: SVGSVGElement, delay: number = 0) => {
    return new Promise(async (resolve, reject) => {
      const base64 = window.btoa(new XMLSerializer().serializeToString(svg));

      const image = new Image();
      image.width = GIF_WIDTH;
      image.height = GIF_HEIGHT;

      image.onload = () => {
        gifEncoder.addFrame(image, { delay: delay });
        resolve(true);
      }
      image.onerror = reject;
      image.src = `data:image/svg+xml;base64,${base64}`;
    });
  }, [gifEncoder]);

  const renderGif = useCallback(() => {
    gifEncoder.render();
    // Create a fresh encoder for next share
    setGifEncoder(createGifEncoder(`Crosswordle-${crosswordIndex + 1}.gif`, () => setCreatingGif(false)));
  }, [gifEncoder, setGifEncoder, crosswordIndex]);

  const share = useCallback(async () => {
    trackShare(crosswordIndex, isGameWon, isGameLost, totalGuesses);

    let shareText = 'https://crosswordle.mekoppe.com';
    if (isGameWon) shareText = `I solved the crosswordle in ${timeText}${totalGuesses} Guesses!\n${shareText}`;
    navigator.clipboard.writeText(shareText);

    const svg = svgRef.current;
    if (!svg) return;

    setCreatingGif(true);

    const playback = new Promise(async (resolve) => {
      await addSvgFrame(svg);
      for (let i = 0; i < shareHistory.length; i++) {
        setCellColors(shareHistory[i]);
        await sleep(GIF_DELAY / 2);
        // Show the last cell for a longer period of time
        const delay = i === (shareHistory.length - 1) ? GIF_DELAY * 5 : GIF_DELAY;
        await addSvgFrame(svg, delay);
      }
      renderGif();
      resolve('');
    });

    toast.promise(playback, {
      pending: 'Rendering shareable GIF',
      success: 'Replay GIF downloaded and shareable link copied to clipboard',
      error: 'Something went wrong...'
    });
  }, [svgRef, addSvgFrame, renderGif, shareHistory, isGameWon, isGameLost, totalGuesses, crosswordIndex, timeText]);

  let title = `Crosswordle ${crosswordIndex + 1}`;
  if (isGameWon) title = 'You Won!';
  if (isGameLost) title = 'You Lost!';

  const renderTitleIcon = () => {
    if (isGameWon) {
      return (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckIcon
            className="h-6 w-6 text-green-600"
            aria-hidden="true"
          />
        </div>
      );
    }

    if (isGameLost) {
      return (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <XIcon
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
      );
    }
  };

  const gifTitle = `Crosswordle ${crosswordIndex + 1} - ${totalGuesses} Guesses`;

  return (
    <Modal name='share' title={title} titleIcon={renderTitleIcon()}>
      <div>
        {isGameWon && (
          <>
            <p>You solved the crosswordle in {timeText}{totalGuesses} guesses!</p>
            <p className="text-sm text-gray-500">Great job.</p>
          </>
        )}
        {isGameLost && (
          <>
            <p>You made {totalGuesses} guesses!</p>
            <p className="text-sm text-gray-500">Better luck next time!</p>
          </>
        )}
        {!isGameWon && !isGameLost && totalGuesses > 0 && <p>You have made {totalGuesses} guesses!</p>}
        <Stats />
        <div className="flex justify-center items-end w-full overflow-y-hidden" style={{ height: SVG_WIDTH }}>
          {gridData && <MiniCrossword title={gifTitle} gridData={gridData} ref={svgRef} cellColors={cellColors} />}
        </div>
        <div className="mt-5 sm:mt-6">
          <div className='flex justify-center items-center text-center'>
            {!outOfPuzzles &&(
              <div className='w-1/2 border-r-slate-300 border-r-[1px] mr-2 flex-col justify-center items-center text-center'>
                <p>Next Crosswordle</p>
                <p className='text-xl'>{timeTillNext}</p>
              </div>
            )}
            <div className='w-1/2 ml-2 flex justify-center items-center text-center'>
              <button
                type="button"
                className="inline-flex justify-center w-full h-10 my-auto rounded-md border border-transparent shadow-sm px-4 py-2 disabled:bg-indigo-200 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                disabled={creatingGif}
                onClick={share}
              >
                {creatingGif ? 'Creating GIF' : (
                  <>
                    <span className="mr-2">Share</span>
                    <ShareIcon width={20} height={20}/>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col mx-auto items-center m-4 md:m-6 text-center border-t border-t-slate-300">
          <p className="p-4">Thanks for Playing!</p>
          <p className="text-sm text-gray-500">
            I have decided to stop work on the crosswordle to make more room for other projects and adventures in my life.
            I will not be publishing puzzles past late August, but if you really like the game and want to take over the project
            you can email me at{' '}
            <a href="mailto:matthew@crosswordle.com" target='_blank' rel="noreferrer" className='text-indigo-500'>
              matthew@crosswordle.com
            </a>.
          </p>
        </div>
      </div>
    </Modal>
  )
}
