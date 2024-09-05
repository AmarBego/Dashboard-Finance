import { styled } from '@mui/material/styles';
import { AppBar, Button } from '@mui/material';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: theme.zIndex.drawer + 1,
    borderRadius: 0,
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  }));
  
  export const LogoutButton = styled(Button)(({ theme }) => ({
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
