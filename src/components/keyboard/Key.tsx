import { ReactNode } from 'react';
import classnames from 'classnames';
import { KeyValue } from '../../lib/keyboard';
import { CharStatus } from '../../lib/statuses';

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
  const classes = classnames(
    'flex items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer keyboard-key dark:text-white',
    `keyboard-key-${size}`,
    {
      'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400': !status,
      'bg-slate-400 text-white': status === 'absent',
      'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white dark:bg-green-700':
        status === 'correct',
      'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white dark:bg-yellow-700':
        status === 'present',
      'bg-cross-slate': !status && crossedStatus === 'absent',
      'bg-cross-main': status === 'present' && crossedStatus === 'absent',
      'bg-cross-green': status === 'correct' && crossedStatus === 'absent',
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
