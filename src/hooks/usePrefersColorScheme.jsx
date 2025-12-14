import { useEffect, useState } from 'react';

export function usePrefersColorScheme() {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    if (media.matches) {
      setMode('dark');
    }
    const listener = (e) => {
      setMode(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return mode;
}
