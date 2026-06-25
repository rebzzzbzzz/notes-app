import { useState, useEffect, useRef } from 'react';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);
  return debounced;
}