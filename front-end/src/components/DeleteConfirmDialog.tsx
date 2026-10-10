import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useRef } from 'react';
import type { Task } from '../types';

interface DeleteConfirmDialogProps {
  task: Task | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  task,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open={task !== null}
      onClose={onClose}
      maxWidth="xs"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      TransitionProps={{
        onEntered: () => cancelRef.current?.focus(),
      }}
    >
      <DialogTitle id="delete-dialog-title">Excluir tarefa</DialogTitle>
      <DialogContent>
        <Typography variant="body2" id="delete-dialog-description">
          Deseja excluir a tarefa &ldquo;{task?.description}&rdquo;? Esta ação
          não pode ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button ref={cancelRef} variant="text" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
