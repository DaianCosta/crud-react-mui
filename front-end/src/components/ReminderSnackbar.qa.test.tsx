/**
 * QA tests — AC-7 visual rendering
 *
 * The unit tests in useReminder.test.tsx prove the hook logic fires correctly.
 * These tests prove the Snackbar (ReminderSnackbar) actually renders the visual
 * alert with the task description when a task is within 60 seconds of its time,
 * fulfilling the "exibe um lembrete visual … com a descrição da tarefa" part of AC-7.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import App from '../App';
import { saveTasks } from '../services/taskStorage';
import type { Task } from '../types';
import { buildTheme } from '../theme';
import { ReminderSnackbar } from './ReminderSnackbar';

function renderApp() {
  return render(<App />);
}

describe('ReminderSnackbar — AC-7 visual rendering', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('AC-7: renders nothing when reminder is null', () => {
    render(
      <ThemeProvider theme={buildTheme('light')}>
        <ReminderSnackbar reminder={null} onDismiss={vi.fn()} />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('AC-7: renders Snackbar with task description when reminder is provided', () => {
    const task: Task = {
      id: 'snack-1',
      description: 'Reunião importante',
      date: '2026-10-10',
      time: '10:00',
      reminded: false,
    };

    render(
      <ThemeProvider theme={buildTheme('light')}>
        <ReminderSnackbar reminder={task} onDismiss={vi.fn()} />
      </ThemeProvider>,
    );

    // AC-7: visual alert must be present with the task description
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Reunião importante');
    expect(alert).toHaveTextContent('Lembrete:');
  });

  it('AC-7: App shows Snackbar with description when task is within 60 seconds', async () => {
    // Pin time to 2026-10-10T10:00:00 (in local time)
    const fixedNow = new Date('2026-10-10T10:00:00').getTime();
    vi.spyOn(Date, 'now').mockReturnValue(fixedNow);

    const task: Task = {
      id: 'snack-2',
      description: 'Alarme de integração',
      date: '2026-10-10',
      time: '10:00', // same minute → diff ≤ 60 000 ms
      reminded: false,
    };
    saveTasks([task]);

    renderApp();

    // AC-7: the visual reminder must appear in the rendered UI
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Alarme de integração');
    expect(screen.getByRole('alert')).toHaveTextContent('Lembrete:');
  });
});
