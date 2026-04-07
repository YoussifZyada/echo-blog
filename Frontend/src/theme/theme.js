import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000', // Audi Red
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#0a0a0a', // Deep Charcoal
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;