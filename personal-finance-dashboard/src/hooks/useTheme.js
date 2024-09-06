import { useState, useEffect, useMemo } from 'react';
import getTheme from '../styles/theme'; 

export function useTheme(user) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const updateThemeInDatabase = async (newMode) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/theme`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ selectedTheme: newMode })
      });
      if (!response.ok) {
        throw new Error('Failed to update theme in database');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 500);
      if (user) {
        updateThemeInDatabase(newMode);
      }
      return newMode;
    });
  };

  useEffect(() => {
    document.body.dataset.theme = mode;
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return { mode, toggleTheme, theme };
}