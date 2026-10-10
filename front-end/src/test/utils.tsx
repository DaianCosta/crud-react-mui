import { ThemeProvider } from '@mui/material';
import { render, type RenderOptions } from '@testing-library/react';
import React from 'react';
import { buildTheme } from '../theme';

export function renderWithTheme(ui: React.ReactElement, options?: RenderOptions) {
  return render(
    <ThemeProvider theme={buildTheme('light')}>{ui}</ThemeProvider>,
    options,
  );
}
