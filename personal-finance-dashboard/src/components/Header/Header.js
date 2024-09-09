import React from 'react';
import { Toolbar, Typography, Box, Avatar, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { StyledAppBar, LogoutButton } from './styles';

const Header = ({ user, onLogout, onDrawerToggle }) => {
  const theme = useTheme();
  const displayName = user && user.username ? user.username : 'User';

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
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              Hello, {displayName}!
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