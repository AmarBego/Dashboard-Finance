import React from 'react';
import { Box, Switch, styled } from '@mui/material';
import { ThemeSwitch } from './styles';

const ThemeToggle = ({ mode, toggleTheme, ...props }) => {
  const { button, ...restProps } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ThemeSwitch 
        checked={mode === 'dark'} 
        onChange={toggleTheme}
        {...restProps}  
      />
    </Box>
  );
};

export default ThemeToggle;