import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../components/TaskForm';
import { renderWithTheme } from '../test/utils';

function renderForm(
  props: Partial<React.ComponentProps<typeof TaskForm>> = {},
) {
  const onClose = vi.fn();
  const onSave = vi.fn();
  renderWithTheme(
    <TaskForm
      open={true}
      onClose={onClose}
      onSave={onSave}
      title="Nova Tarefa"
      {...props}
    />,
  );
  return { onClose, onSave };
}

describe('TaskForm', () => {
  it('AC-2: shows validation errors when submitting empty form', async () => {
    const { onSave } = renderForm();

    // Submit without filling any field
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText('A descrição é obrigatória.')).toBeInTheDocument();
      expect(screen.getByText('Informe uma data válida.')).toBeInTheDocument();
    });

    // Task must NOT be created when form is invalid
    expect(onSave).not.toHaveBeenCalled();
  });

  it('AC-2: shows error only for the empty field when others are filled', async () => {
    const user = userEvent.setup();
    renderForm();

    // Fill description and date but leave time empty
    await user.type(screen.getByLabelText(/descrição/i), 'Minha tarefa');
    await user.type(screen.getByLabelText(/data/i), '2026-11-01');

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText('Informe um horário válido.')).toBeInTheDocument();
    });
    expect(screen.queryByText('A descrição é obrigatória.')).toBeNull();
  });

  it('AC-3: calls onSave with correct values when form is valid', async () => {
    const user = userEvent.setup();
    const { onSave } = renderForm();

    await user.type(screen.getByLabelText(/descrição/i), 'Minha tarefa');
    await user.type(screen.getByLabelText(/data/i), '2026-11-01');
    await user.type(screen.getByLabelText(/hora/i), '09:30');

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Minha tarefa', '2026-11-01', '09:30');
    });
  });

  it('AC-4: pre-fills fields when editing an existing task', () => {
    renderForm({
      title: 'Editar Tarefa',
      initial: { description: 'Existente', date: '2026-10-15', time: '14:00' },
    });

    expect(screen.getByDisplayValue('Existente')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-10-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('14:00')).toBeInTheDocument();
  });

  it('closes dialog on cancel without saving', async () => {
    const user = userEvent.setup();
    const { onClose, onSave } = renderForm();

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(onSave).not.toHaveBeenCalled();
  });
});
