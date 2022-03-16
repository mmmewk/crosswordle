import { ReactNode } from 'react';
import classnames from 'classnames';
import { KeyValue } from '../../lib/keyboard';
import { CharStatus } from '../../lib/statuses';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Props = {
  children?: ReactNode;
  value: KeyValue;
  size?: 'sm' | 'lg';
  status?: CharStatus;
  crossedStatus?: CharStatus;
  onClick?: (value: KeyValue) => void;
}

export const Key = ({
  children,
  status,
  crossedStatus,
  size = 'sm',
  value,
  onClick = () => {},
}: Props) => {
  const highContrastMode = useSelector((state: RootState) => state.settings.highContrastMode);

  const classes = classnames(
    'flex items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer keyboard-key dark:text-white',
    `keyboard-key-${size}`,
    {
      'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400': !status,
      'bg-slate-400 text-white': status === 'absent',
      'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white dark:bg-green-700':
        status === 'correct' && !highContrastMode,
      'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white dark:bg-yellow-700':
        status === 'present' && !highContrastMode,
      'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white dark:bg-orange-700':
        status === 'correct' && highContrastMode,
      'bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white dark:bg-cyan-700':
        status === 'present' && highContrastMode,
      'bg-cross-slate': !status && crossedStatus === 'absent',
      'bg-cross-yellow': status === 'present' && crossedStatus === 'absent' && !highContrastMode,
      'bg-cross-cyan': status === 'present' && crossedStatus === 'absent' && highContrastMode,
      'bg-cross-green': status === 'correct' && crossedStatus === 'absent' && !highContrastMode,
      'bg-cross-orange': status === 'correct' && crossedStatus === 'absent' && highContrastMode,
    }
  )

  return (
    <div
      className={classes}
      onClick={() => onClick(value)}
    >
      {children || value}
    </div>
  )
}
