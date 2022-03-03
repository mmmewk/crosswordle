import { CharStatus } from '../../lib/statuses'
import classnames from 'classnames'
import { useMediaBreakpoints } from '../../lib/hooks'
import { useWindowHeight } from '@react-hook/window-size/throttled'

type Props = {
  value?: string;
  knownValue?: string;
  status?: CharStatus;
  size?: 'sm' | 'lg';
  isFocused?: boolean;
}

export const Cell = ({ value, knownValue, status, size = 'lg', isFocused = false }: Props) => {
  const isMobile = useMediaBreakpoints('md', 'down');
  const height = useWindowHeight();

  const classes = classnames(
    'border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded dark:text-white',
    {
      'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-600': !status,
      'bg-white border-slate-200 text-green-500 text-opacity-50 dark:text-green-500': knownValue && !value,
      'bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700': status === 'absent',
      'bg-green-500 text-white border-green-500': status === 'correct',
      'bg-yellow-500 dark:bg-yellow-700 text-white border-yellow-500 dark:border-yellow-700': status === 'present',
      'w-14 h-14 text-lg': size === 'lg',
      'w-5 h-5 text-sm': size === 'sm',
      'w-12 h-12 text-lg': size === 'lg' && isMobile,
      'border-yellow-300': isFocused,
      'short-tolerant': !isMobile && height > 600,
    }
  )

  return (
    <>
      <div className={classes}>{value || knownValue}</div>
    </>
  )
}
