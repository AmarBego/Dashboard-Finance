import { styled } from '@mui/material/styles';
import { Button, Paper, Tab, Tabs, TextField } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
}));

export const GreenButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4caf50',
  '&:hover': {
    backgroundColor: '#45a049',
  },
}));

export const GreenTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#4caf50',
  },
});

export const GreenTab = styled(Tab)({
  '&.Mui-selected': {
    color: '#4caf50',
  },
});

export const GreenTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#4caf50',
      },
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },

    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.7)',
      '&.Mui-focused': {
        color: '#4caf50',
      },
    },
    '& .MuiInputBase-input': {
      color: 'black',
      '&:-webkit-autofill': {
        '-webkit-box-shadow': '0 0 0 100px white inset',
        '-webkit-text-fill-color': 'black',
        'caret-color': 'black',
      },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: 'rgba(0, 0, 0, 0.54)',
    },
  }));