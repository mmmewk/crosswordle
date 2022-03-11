import { ChevronRightIcon } from '@heroicons/react/outline';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crosswordIndex } from '../../lib/utils';
import Spinner from '../shared/spinner';
import ArchiveElement from './ArchiveElement';

const PER_PAGE = 7;

const Archive : React.FC = () => {
  const navigate = useNavigate();
  const [bottomIndex, setBottomIndex] = useState(crosswordIndex - PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(() => {
    setIsLoadingMore(true);

    // Simulate loading from an actual api
    setTimeout(() => {
      setBottomIndex(Math.max(bottomIndex - PER_PAGE, 0));
      setIsLoadingMore(false);
    }, 1000 * Math.random());
  }, [bottomIndex]);

  const indicies = useMemo(() => {
    return Array.from(Array(crosswordIndex + 1).keys()).filter(index => index >= bottomIndex).reverse();
  }, [bottomIndex]);

  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex w-screen mx-auto items-center border-b-slate-400 border-b-[1px] p-4 sticky top-0 bg-white">
        <div className='grow flex flex-row justify-between'>
          <h1 className="text-l md:text-xl font-bold whitespace-nowrap dark:text-white">Puzzle Archive</h1>
          <p onClick={() => navigate('/')} className=" text-l md:text-xl cursor-pointer text-indigo-600">Daily puzzle <ChevronRightIcon className='inline w-4' /></p>
        </div>
      </div>
      <div className='w-screen text-center'>
        <div className='flex flex-wrap justify-center w-full mx-auto'>
          {indicies.map((index) => <ArchiveElement index={index} key={index.toString()} />)}
        </div>
        {bottomIndex > 0 && (
          <button onClick={loadMore} className="rounded bg-indigo-600 text-white p-3 my-5 flex mx-auto">
            {isLoadingMore ? <span className='ml-3'><Spinner size={15} /></span> : 'Load More'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Archive;
