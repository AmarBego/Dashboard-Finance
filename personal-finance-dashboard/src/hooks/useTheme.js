import { useState, useEffect, useMemo } from 'react';
import getTheme from '../styles/theme'; 

export function useTheme() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 500);
      return newMode;
    });
  };

  useEffect(() => {
    document.body.dataset.theme = mode;
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return { mode, toggleTheme, theme };
}