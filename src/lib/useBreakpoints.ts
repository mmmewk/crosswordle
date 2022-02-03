import { useWindowWidth } from '@react-hook/window-size/throttled';

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
