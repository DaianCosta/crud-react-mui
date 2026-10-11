import { CssBaseline, ThemeProvider } from '@mui/material';
import { useMemo, useState } from 'react';
import { TasksPage } from './pages/TasksPage';
import { buildTheme } from './theme';

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = useMemo(() => buildTheme(mode), [mode]);

  function toggleTheme() {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TasksPage mode={mode} toggleTheme={toggleTheme} />
    </ThemeProvider>
  );
}
