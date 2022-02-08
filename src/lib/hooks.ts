import { useWindowWidth } from '@react-hook/window-size/throttled';
import { useRef, useState } from 'react';

const BREAKPOINTS = {
  xs: 414,
  sm: 640,
  md: 768,
  lg: 1024,
} as const;

export const useMediaBreakpoints = (size: 'sm' | 'md' | 'lg', direction: 'up' | 'down') => {
  const width = useWindowWidth();
  if (direction === 'up') {
    return width >= BREAKPOINTS[size];
  } else {
    return width < BREAKPOINTS[size];
  }
}

export const useRefState = <T>(initial: T | (() => T)) => {
  const [state, _setState] = useState<T>(initial);
  const stateRef = useRef(state);

  const setState = (value: T) => {
    _setState(value);
    stateRef.current = value;
  };

  return [state, setState, stateRef] as const;
};
