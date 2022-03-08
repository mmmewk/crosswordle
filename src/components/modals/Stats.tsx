import { useStats } from '../../redux/hooks/useStats';

export const Stats : React.FC = () => {
  const { totalGames, winRatio, averageGuesses, streak } = useStats();

  if (totalGames < 1) return null;

  return (
    <div className='flex w-full justify-center mt-4'>
      <div className='flex flex-col mr-3'>
        <b>{totalGames}</b>
        <span>Played</span>
      </div>
      <div className='flex flex-col mr-3'>
        <b>{Math.round(winRatio * 100)}</b>
        <span>Win %</span>
      </div>
      <div className='flex flex-col mr-3'>
        <b>{(averageGuesses).toFixed(1)}</b>
        <span>Avg Guesses</span>
      </div>
      <div className='flex flex-col'>
        <b>{streak}</b>
        <span>Streak</span>
      </div>
    </div>
  )
}
