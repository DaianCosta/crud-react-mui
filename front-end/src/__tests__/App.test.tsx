import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import App from '../App';
import { saveTasks } from '../services/taskStorage';
import { loadTasks } from '../services/taskStorage';
import type { Task } from '../types';

function renderApp() {
  return render(<App />);
}

describe('App — integration', () => {
  it('AC-1: renders without errors and shows the task list (empty state)', async () => {
    renderApp();
    // AppBar present — AC-8
    expect(screen.getByText('Gerenciador de Tarefas')).toBeInTheDocument();
    // Empty state message
    await waitFor(() => {
      expect(screen.getByText('Nenhuma tarefa cadastrada.')).toBeInTheDocument();
    });
  });

  it('AC-8: AppBar with title and theme toggle button is present', () => {
    renderApp();
    expect(screen.getByText('Gerenciador de Tarefas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /alternar tema/i })).toBeInTheDocument();
  });

  it('AC-6: loads tasks from localStorage on mount', async () => {
    const tasks: Task[] = [
      { id: '1', description: 'Tarefa do localStorage', date: '2026-10-10', time: '10:00', reminded: false },
    ];
    saveTasks(tasks);

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Tarefa do localStorage')).toBeInTheDocument();
    });
  });

  it('AC-3: creates a task; it appears in the list and is saved to localStorage', async () => {
    const user = userEvent.setup();
    renderApp();

    // Open the form
    fireEvent.click(screen.getByRole('button', { name: /nova tarefa/i }));

    // Fill in the form
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    await user.type(screen.getByLabelText(/descrição/i), 'Consulta médica');
    await user.type(screen.getByLabelText(/data/i), '2026-11-01');
    await user.type(screen.getByLabelText(/hora/i), '15:00');

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    // Task appears in list
    await waitFor(() => {
      expect(screen.getByText('Consulta médica')).toBeInTheDocument();
    });

    // Task persisted in localStorage
    const stored = loadTasks();
    expect(stored.some((t) => t.description === 'Consulta médica')).toBe(true);
  });

  it('AC-4: edits a task; changes are saved to localStorage', async () => {
    const user = userEvent.setup();
    const tasks: Task[] = [
      { id: 'edit-1', description: 'Original', date: '2026-10-10', time: '08:00', reminded: false },
    ];
    saveTasks(tasks);

    renderApp();

    await waitFor(() => expect(screen.getByText('Original')).toBeInTheDocument());

    // Click edit button
    fireEvent.click(screen.getByRole('button', { name: /editar tarefa/i }));

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // Clear description and type new value
    const descInput = screen.getByDisplayValue('Original');
    await user.clear(descInput);
    await user.type(descInput, 'Editada');

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText('Editada')).toBeInTheDocument();
    });

    // Persisted in localStorage
    const stored = loadTasks();
    expect(stored.some((t) => t.description === 'Editada')).toBe(true);
    expect(stored.some((t) => t.description === 'Original')).toBe(false);
  });

  it('AC-5: deletes a task after confirmation; it disappears from list and localStorage', async () => {
    const user = userEvent.setup();
    const tasks: Task[] = [
      { id: 'del-1', description: 'Para excluir', date: '2026-10-10', time: '08:00', reminded: false },
    ];
    saveTasks(tasks);

    renderApp();

    await waitFor(() => expect(screen.getByText('Para excluir')).toBeInTheDocument());

    // Click delete button
    fireEvent.click(screen.getByRole('button', { name: /excluir tarefa/i }));

    // Confirmation dialog
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /excluir tarefa/i })).toBeInTheDocument(),
    );
    expect(screen.getByText(/Deseja excluir a tarefa/)).toBeInTheDocument();

    // Confirm
    const dialog = screen.getByRole('dialog', { name: /excluir tarefa/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /excluir/i }));

    await waitFor(() => {
      expect(screen.queryByText('Para excluir')).toBeNull();
    });

    // Removed from localStorage
    expect(loadTasks()).toHaveLength(0);
  });

  it('AC-5: cancelling the delete dialog keeps the task intact', async () => {
    const tasks: Task[] = [
      { id: 'keep-1', description: 'Não excluir', date: '2026-10-10', time: '09:00', reminded: false },
    ];
    saveTasks(tasks);

    renderApp();

    await waitFor(() => expect(screen.getByText('Não excluir')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /excluir tarefa/i }));

    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /excluir tarefa/i })).toBeInTheDocument(),
    );

    const dialog = screen.getByRole('dialog', { name: /excluir tarefa/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /cancelar/i }));

    await waitFor(() => {
      expect(screen.getByText('Não excluir')).toBeInTheDocument();
    });
    expect(loadTasks()).toHaveLength(1);
  });
});
