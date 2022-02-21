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
  onClick: (value: KeyValue) => void;
}

export const Key = ({
  children,
  status,
  size = 'sm',
  value,
  onClick,
}: Props) => {
  const classes = classnames(
    'flex items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer keyboard-key',
    `keyboard-key-${size}`,
    {
      'bg-slate-200 hover:bg-slate-300 active:bg-slate-400': !status,
      'bg-slate-400 text-white': status === 'absent',
      'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white':
        status === 'correct',
      'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white':
        status === 'present',
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
