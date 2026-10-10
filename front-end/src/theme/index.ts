import { createTheme, type PaletteMode, type Theme } from '@mui/material';

export function buildTheme(mode: PaletteMode): Theme {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1565C0' : '#42A5F5',
        light: mode === 'light' ? '#1E88E5' : '#90CAF9',
        dark: mode === 'light' ? '#0D47A1' : '#1565C0',
      },
      background: {
        default: mode === 'light' ? '#F5F7FA' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
      error: { main: mode === 'light' ? '#D32F2F' : '#EF5350' },
      warning: { main: mode === 'light' ? '#E65100' : '#FFA726' },
      success: { main: mode === 'light' ? '#2E7D32' : '#66BB6A' },
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      button: { textTransform: 'none', fontWeight: 500 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 16 } },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': {
              textTransform: 'uppercase',
              fontWeight: 600,
              fontSize: '0.75rem',
            },
          },
        },
      },
    },
  });
}
