import { useSelector } from 'react-redux';
import { useGridData } from '../../redux/hooks/useGridData';
import { RootState } from '../../redux/store';
import { MiniCrossword } from '../mini-crossword/MiniCrossword';
import last from 'lodash/last';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { crosswordIndex, dateFromPuzzleIndex } from '../../lib/utils';
import crosswords from '../../constants/crosswords';

interface Props {
  index: number;
};

const ArchiveElement : React.FC<Props> = ({ index }) => {
  const navigate = useNavigate();
  const [gridData] = useGridData(index);
  const shareHistory = useSelector((state: RootState) => state.wordle.shareHistories[index]);
  const cellColors = useMemo(() => last(shareHistory) || {}, [shareHistory]);
  const crosswordData = crosswords[index];

  const onClick = useCallback(() => {
    if (index === crosswordIndex) {
      navigate('/');
    } else if (index > -1 && index < crosswordIndex) {
      navigate(`/puzzles/${index + 1}`);
    }
  }, [index, navigate]);

  const releaseDate = dateFromPuzzleIndex(index).toLocaleDateString('en-us',{
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div onClick={onClick} className="m-3 cursor-pointer">
      <h3 className='text-xl'>Crosswordle {index + 1}</h3>
      <MiniCrossword gridData={gridData} cellColors={cellColors} margin={5} />
      <p className='text-slate-400'>{releaseDate}</p>
      <p className='text-slate-400'>By {crosswordData.author || 'Matthew Koppe'}</p>
    </div>
  );
};

export default ArchiveElement;
