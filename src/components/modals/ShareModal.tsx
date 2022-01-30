import Gif from 'gif.js';
import { saveAs } from 'file-saver';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { XCircleIcon } from '@heroicons/react/outline'
import { StoredGameState } from '../../lib/localStorage';
import { GridData } from 'react-crossword-v2/dist/types';
import { MiniCrossword, CellColors } from '../mini-crossword/MiniCrossword';
import { sleep } from '../../lib/utils';

const GIF_SIZE = 250;
const GIF_DELAY = 500;

const createGifEncoder = (filename: string) => {
  const gifEncoder = new Gif({
    width: GIF_SIZE,
    height: GIF_SIZE,
    workers: 2,
    quality: 1,
    repeat: 0,
  })
  
  gifEncoder.on('finished', function(blob) {
    saveAs(blob, filename);
  });
  
  return gifEncoder;
};

type Guesses = StoredGameState['guesses'];

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  guesses: Guesses;
  shareHistory?: CellColors[];
  getGridData: () => GridData | undefined;
  crosswordleIndex: number;
  handleShare: () =>  void;
}

export const ShareModal = ({
  isOpen,
  handleClose,
  guesses,
  shareHistory = [],
  getGridData,
  crosswordleIndex,
  handleShare,
}: Props) => {
  const [gifEncoder, setGifEncoder] = useState<Gif>(createGifEncoder(`Crosswordle-${crosswordleIndex}.gif`));
  const [gridData, setGridData] = useState<GridData>();
  const svgRef = useRef<SVGSVGElement>(null);
  const [cellColors, setCellColors] = useState<{ [key: string]: string }>();
  const acrossGuesses = Object.values(guesses['across']).flat().length;
  const downGuesses = Object.values(guesses['down']).flat().length;
  const totalGuesses = acrossGuesses + downGuesses;

  useEffect(() => {
    if (isOpen) setGridData(getGridData());
  }, [isOpen, getGridData]);


  const addSvgFrame = useCallback((svg: SVGSVGElement) => {
    return new Promise(async (resolve, reject) => {
      svg.setAttribute('width', GIF_SIZE.toString());
      svg.setAttribute('height', GIF_SIZE.toString());

      const base64 = window.btoa(new XMLSerializer().serializeToString(svg));

      svg.setAttribute('width', '100');
      svg.setAttribute('height', '100');

      const image = new Image();
      image.width = GIF_SIZE;
      image.height = GIF_SIZE;
      document.body.appendChild(image);

      image.onload = () => {
        gifEncoder.addFrame(image, { delay: GIF_DELAY });
        resolve(true);
      }
      image.onerror = reject;
      image.src = `data:image/svg+xml;base64,${base64}`;
    });
  }, [gifEncoder]);

  const renderGif = useCallback(() => {
    gifEncoder.render();
    // Create a fresh encoder for next share
    setGifEncoder(createGifEncoder(`Crosswordle-${crosswordleIndex}.gif`));
  }, [gifEncoder, crosswordleIndex, setGifEncoder]);

  const createGif = useCallback(async () => {
    const svg = svgRef.current;
    if (!svg) return;

    await addSvgFrame(svg);
    for (let i = 0; i < shareHistory.length; i++) {
      setCellColors(shareHistory[i]);
      await sleep(100)
      await addSvgFrame(svg);
    }
    renderGif();
  }, [svgRef, addSvgFrame, renderGif, shareHistory]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div className="absolute right-4 top-4">
                <XCircleIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => handleClose()}
                />
              </div>
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    You won!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p>You solved the crosswordle in {totalGuesses} guesses!</p>
                    <p className="text-sm text-gray-500">Great job.</p>
                  </div>
                  <div className="flex justify-center w-full my-5">
                    {gridData && <MiniCrossword gridData={gridData} ref={svgRef} cellColors={cellColors} />}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => {
                    createGif();
                    handleShare();
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
