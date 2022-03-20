import { useEffect, useRef } from 'react';

export function useWindowListener(action: keyof WindowEventMap, callback: Function) {
  const savedCallback = useRef<Function>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const listener = (e: any) => {
      if (savedCallback.current) savedCallback.current(e);
    }

    window.addEventListener(action, listener);
    return () => {
      window.removeEventListener(action, listener);
    }
  }, [action]);
}
