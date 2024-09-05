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

export const GreenTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#4caf50',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#4caf50',
  },
});
