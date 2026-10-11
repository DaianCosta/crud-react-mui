import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { Task } from '../types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (description: string, date: string, time: string) => void;
  initial?: Pick<Task, 'description' | 'date' | 'time'>;
  title: string;
}

interface FieldErrors {
  description: string;
  date: string;
  time: string;
}

interface TouchedFields {
  description: boolean;
  date: boolean;
  time: boolean;
}

function validate(
  description: string,
  date: string,
  time: string,
): FieldErrors {
  return {
    description: description.trim() === '' ? 'A descrição é obrigatória.' : '',
    date: date === '' ? 'Informe uma data válida.' : '',
    time: time === '' ? 'Informe um horário válido.' : '',
  };
}

export function TaskForm({
  open,
  onClose,
  onSave,
  initial,
  title,
}: TaskFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [touched, setTouched] = useState<TouchedFields>({
    description: false,
    date: false,
    time: false,
  });

  useEffect(() => {
    if (open) {
      setDescription(initial?.description ?? '');
      setDate(initial?.date ?? '');
      setTime(initial?.time ?? '');
      setTouched({ description: false, date: false, time: false });
    }
  }, [open, initial]);

  const errors = validate(description, date, time);
  const hasErrors = Object.values(errors).some((e) => e !== '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ description: true, date: true, time: true });
    if (hasErrors) return;
    onSave(description.trim(), date, time);
  }

  function handleBlur(field: keyof TouchedFields) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="task-form-title"
    >
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle id="task-form-title">{title}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur('description')}
              multiline
              rows={2}
              required
              error={touched.description && errors.description !== ''}
              helperText={
                touched.description && errors.description !== ''
                  ? errors.description
                  : undefined
              }
              inputProps={{ 'aria-label': 'Descrição' }}
            />
            <TextField
              label="Data"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onBlur={() => handleBlur('date')}
              required
              InputLabelProps={{ shrink: true }}
              error={touched.date && errors.date !== ''}
              helperText={
                touched.date && errors.date !== '' ? errors.date : undefined
              }
              inputProps={{ 'aria-label': 'Data' }}
            />
            <TextField
              label="Hora"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              onBlur={() => handleBlur('time')}
              required
              InputLabelProps={{ shrink: true }}
              error={touched.time && errors.time !== ''}
              helperText={
                touched.time && errors.time !== ''
                  ? errors.time
                  : 'Informe a hora (ex.: 00:00 para lembretes no dia).'
              }
              inputProps={{ 'aria-label': 'Hora' }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" type="submit">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
