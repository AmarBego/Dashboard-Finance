import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: theme.zIndex.drawer + 1,
    borderRadius: 0,
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  }));
  
  const LogoutButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    borderRadius: theme.shape.borderRadius,
    textTransform: 'none',
    padding: '6px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s ease, color 0.15s ease',
  }));

const Header = ({ user, onLogout, onDrawerToggle }) => {
  const theme = useTheme();
  const username = user ? user.email.split('@')[0] : '';

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: theme.palette.primary.main }}>
          Personal Finance Dashboard
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              Hello, {username}!
            </Typography>
            <LogoutButton onClick={onLogout}>
              <LogoutIcon fontSize="small" />
              Logout
            </LogoutButton>
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;