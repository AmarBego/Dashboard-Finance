import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#13AA52' : '#00ED64',
      light: mode === 'light' ? '#1EC16D' : '#00FF6E',
      dark: mode === 'light' ? '#0E8040' : '#00D45A',
      contrastText: mode === 'light' ? '#FFFFFF' : '#061621',
    },
    secondary: {
      main: mode === 'light' ? '#016BF8' : '#0498EC',
      light: mode === 'light' ? '#3388FF' : '#05AFF2',
      dark: mode === 'light' ? '#0053C2' : '#0384D1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#F9FBFA' : '#061621',
      paper: mode === 'light' ? '#FFFFFF' : '#0C2231',
    },
    text: {
      primary: mode === 'light' ? '#1C2D38' : '#E6F7FF',
      secondary: mode === 'light' ? '#3D4F58' : '#B1C9D8',
    },
    grey: {
      50: mode === 'light' ? '#F5F6F7' : '#0C2231',
      100: mode === 'light' ? '#E8EAEB' : '#162B3C',
      200: mode === 'light' ? '#CFD1D2' : '#213B4D',
      300: mode === 'light' ? '#B7BABC' : '#2D4A5E',
      400: mode === 'light' ? '#9FA2A5' : '#395970',
      500: mode === 'light' ? '#878A8C' : '#456881',
      600: mode === 'light' ? '#6E7173' : '#517793',
      700: mode === 'light' ? '#565859' : '#5D86A4',
      800: mode === 'light' ? '#3D3E40' : '#6995B6',
      900: mode === 'light' ? '#252627' : '#75A4C7',
    },
  },
  typography: {
    fontFamily: '"Euclid Circular A", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease, color 0.15s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          transition: 'background-color 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease, color 0.15s ease',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease, color 0.15s ease',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          transition: 'color 0.15s ease',
        },
      },
    },
  },
});

export default getTheme;