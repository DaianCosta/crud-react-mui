import AlarmIcon from '@mui/icons-material/Alarm';
import { Alert, Snackbar } from '@mui/material';
import type { Task } from '../types';

interface ReminderSnackbarProps {
  reminder: Task | null;
  onDismiss: () => void;
}

export function ReminderSnackbar({ reminder, onDismiss }: ReminderSnackbarProps) {
  return (
    <Snackbar
      open={reminder !== null}
      autoHideDuration={8000}
      onClose={onDismiss}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="warning"
        variant="filled"
        icon={<AlarmIcon />}
        onClose={onDismiss}
        sx={{ width: '100%' }}
      >
        Lembrete: {reminder?.description} — agora!
      </Alert>
    </Snackbar>
  );
}
