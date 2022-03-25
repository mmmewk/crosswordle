import { AdjustmentsIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crosswordIndex } from '../../lib/utils';
import ArchiveElement from './ArchiveElement';
import crosswords from '../../constants/crosswords';
import Select from 'react-select';
import uniq from 'lodash/uniq';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Modal } from '../modals/Modal';
import { setOpenModal } from '../../redux/slices/navigationSlice';
import Elevator from 'elevator.js';

const elevator = new Elevator({
  mainAudio: `${process.env.PUBLIC_URL}/elevator.mp3`,
  endAudio: `${process.env.PUBLIC_URL}/ding.mp3`,
});

const Archive : React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const crosswordIndicies = Array.from(Array(crosswordIndex + 1).keys());
  const { gameWins, lostCells, shareHistories } = useSelector((state: RootState) => state.wordle);
  const [filters, setFilters] = useState<{
    author?: string,
    gameState?: 'notStarted' | 'inProgress' | 'completed'
  }>({});

  const gameStateOptions = [
    { label: 'Not Started', value: 'notStarted' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Completed', value: 'completed' },
  ] as const;

  const authorsOptions = useMemo(() => {
    return uniq(crosswordIndicies.map((index) => crosswords[index].author || 'Matthew Koppe')).map((author) => ({
      label: author, value: author,
    }))
  }, [crosswordIndicies]);

  const indicies = useMemo(() => {
    const completedGames = { ...gameWins, ...lostCells };

    return crosswordIndicies.filter((index) => {
      if (filters.author && (crosswords[index].author || 'Matthew Koppe') !== filters.author) return false;
      if (filters.gameState === 'notStarted' && shareHistories[index]?.length > 0) return false;
      if (filters.gameState === 'inProgress' && (!shareHistories[index]?.length || completedGames[index])) return false;
      if (filters.gameState === 'completed' && (!completedGames[index])) return false;

      return true;
    }).reverse();
  }, [filters, crosswordIndicies, gameWins, lostCells, shareHistories]);

  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex w-screen mx-auto items-center border-b-slate-400 border-b-[1px] p-4 sticky top-0 bg-white dark:bg-slate-900">
        <div className='grow flex flex-row justify-between items-center'>
          <h1 className="text-l md:text-xl font-bold whitespace-nowrap dark:text-white">Puzzle Archive</h1>
          <div className='flex'>
            <div className='hidden md:flex'>
              <Select
                options={gameStateOptions}
                onChange={(option) => setFilters({ ...filters, gameState: option?.value })}
                placeholder='Filter by game state'
                isClearable
                className='w-30 mr-4'
              />
              <Select
                options={authorsOptions}
                onChange={(option) => setFilters({ ...filters, author: option?.value })}
                placeholder='Filter by author'
                isClearable
                className='w-30 mr-4'
              />
            </div>
            <AdjustmentsIcon
              className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white block md:hidden"
              onClick={() => dispatch(setOpenModal('filters'))}
            />
            <Modal name='filters' title='Filters'>
              <Select
                options={authorsOptions}
                onChange={(option) => setFilters({ ...filters, author: option?.value })}
                placeholder='Filter by author'
                isClearable
                className='w-30 mr-4 my-5'
                maxMenuHeight={200}
              />
              <Select
                options={gameStateOptions}
                onChange={(option) => setFilters({ ...filters, gameState: option?.value })}
                placeholder='Filter by game state'
                isClearable
                className='w-30 mr-4 my-5'
                maxMenuHeight={200}
              />
              <div className='mb-40' />
            </Modal>
            <p onClick={() => navigate('/')} className=" text-l md:text-xl cursor-pointer text-indigo-600 dark:text-white">
              Daily puzzle <ChevronRightIcon className='inline w-4' />
            </p>
          </div>
        </div>
      </div>
      <div className='w-screen text-center'>
        <div className='flex flex-wrap justify-center w-full mx-auto'>
          {indicies.map((index) => <ArchiveElement index={index} key={index.toString()} />)}
        </div>
      </div>
      <button onClick={() => elevator.elevate()} className="mx-auto px-2.5 py-1.5 mb-5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Back to the top
      </button>
    </div>
  )
}

export default Archive;
