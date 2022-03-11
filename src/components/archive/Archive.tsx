import { ChevronRightIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { crosswordIndex } from '../../lib/utils';
import ArchiveElement from './ArchiveElement';

const Archive : React.FC = () => {
  const navigate = useNavigate();
  const indicies = Array.from(Array(crosswordIndex + 1).keys()).reverse();

  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex w-screen mx-auto items-center border-b-slate-400 border-b-[1px] p-4 sticky top-0 bg-white">
        <div className='grow flex flex-row justify-between'>
          <h1 className="text-l md:text-xl font-bold whitespace-nowrap dark:text-white">Puzzle Archive</h1>
          <p onClick={() => navigate('/')} className=" text-l md:text-xl cursor-pointer text-indigo-600">Daily puzzle <ChevronRightIcon className='inline w-4' /></p>
        </div>
      </div>
      <div className='w-screen text-center'>
        <div className='flex flex-wrap justify-around w-full'>
          {indicies.map((index) => <ArchiveElement index={index} key={index.toString()} />)}
        </div>
      </div>
    </div>
  )
}

export default Archive;
