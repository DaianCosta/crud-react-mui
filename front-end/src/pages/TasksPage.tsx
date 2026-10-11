import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { ReminderSnackbar } from '../components/ReminderSnackbar';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useReminder } from '../hooks/useReminder';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types';

interface TasksPageProps {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

export function TasksPage({ mode, toggleTheme }: TasksPageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { tasks, storageError, retry, createTask, updateTask, deleteTask, markReminded } =
    useTasks();
  const { currentReminder, dismissReminder } = useReminder(tasks, markReminded);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  function handleOpenCreate() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function handleOpenEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleSave(description: string, date: string, time: string) {
    if (editingTask) {
      updateTask(editingTask.id, description, date, time);
    } else {
      createTask(description, date, time);
    }
    setFormOpen(false);
  }

  function handleDeleteConfirm() {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  }

  const containerMax = isMobile ? 'xs' : 'md';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <AssignmentIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Gerenciador de Tarefas
          </Typography>
          <Tooltip title={mode === 'light' ? 'Modo escuro' : 'Modo claro'}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              aria-label="alternar tema"
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth={containerMax} sx={{ py: 4 }}>
        {storageError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={retry}>
                Tentar novamente
              </Button>
            }
          >
            {storageError}
          </Alert>
        )}

        <Paper elevation={1} sx={{ p: 3, borderRadius: '12px' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Tarefas
            </Typography>
            {!isMobile && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreate}
              >
                Nova Tarefa
              </Button>
            )}
          </Stack>

          <TaskList
            tasks={tasks}
            onEdit={handleOpenEdit}
            onDelete={setDeletingTask}
          />
        </Paper>
      </Container>

      {isMobile && (
        <Fab
          color="primary"
          aria-label="adicionar tarefa"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={handleOpenCreate}
        >
          <AddIcon />
        </Fab>
      )}

      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editingTask ?? undefined}
        title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      />

      <DeleteConfirmDialog
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
      />

      <ReminderSnackbar reminder={currentReminder} onDismiss={dismissReminder} />
    </Box>
  );
}
