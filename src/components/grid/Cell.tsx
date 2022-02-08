import { CharStatus } from '../../lib/statuses'
import classnames from 'classnames'
import { useMediaBreakpoints } from '../../lib/hooks'

type Props = {
  value?: string;
  knownValue?: string;
  status?: CharStatus;
  size?: 'sm' | 'lg';
}

export const Cell = ({ value, knownValue, status, size = 'lg' }: Props) => {
  const isMobile = useMediaBreakpoints('md', 'down');

  const classes = classnames(
    'border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded',
    {
      'bg-white border-slate-200': !status,
      'bg-white border-slate-200 text-green-500 text-opacity-50': knownValue && !value,
      'bg-slate-400 text-white border-slate-400': status === 'absent',
      'bg-green-500 text-white border-green-500': status === 'correct',
      'bg-yellow-500 text-white border-yellow-500': status === 'present',
      'w-14 h-14 text-lg': size === 'lg',
      'w-5 h-5 text-sm': size === 'sm',
      'w-12 h-12 text-lg': size === 'lg' && isMobile,
    }
  )

  return (
    <>
      <div className={classes}>{value || knownValue}</div>
    </>
  )
}
