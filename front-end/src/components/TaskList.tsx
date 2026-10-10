import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
}

function EmptyState() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <AssignmentIcon
        sx={{ fontSize: 80, opacity: 0.3, color: 'text.secondary', display: 'block', mx: 'auto', mb: 2 }}
      />
      <Typography variant="body1" color="text.secondary">
        Nenhuma tarefa cadastrada.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Clique em &ldquo;+ Nova Tarefa&rdquo; para começar.
      </Typography>
    </Box>
  );
}

function DescriptionCell({ text }: { text: string }) {
  return (
    <Tooltip title={text} disableHoverListener={text.length < 60} placement="top">
      <Typography
        variant="body2"
        sx={{
          maxWidth: 300,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
}

function TaskTable({ tasks, onEdit, onDelete, isTablet }: TaskListProps & { isTablet: boolean }) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '50%' }}>Descrição</TableCell>
            {isTablet ? (
              <TableCell sx={{ width: '35%' }}>Data / Hora</TableCell>
            ) : (
              <>
                <TableCell sx={{ width: '20%' }}>Data</TableCell>
                <TableCell sx={{ width: '15%' }}>Hora</TableCell>
              </>
            )}
            <TableCell sx={{ width: '15%' }} align="right">
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} hover>
              <TableCell>
                <DescriptionCell text={task.description} />
              </TableCell>
              {isTablet ? (
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(task.date)} às {task.time}
                  </Typography>
                </TableCell>
              ) : (
                <>
                  <TableCell>
                    <Typography variant="body2">{formatDate(task.date)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{task.time}</Typography>
                  </TableCell>
                </>
              )}
              <TableCell align="right">
                <IconButton
                  aria-label="Editar tarefa"
                  color="primary"
                  size="small"
                  onClick={() => onEdit(task)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="Excluir tarefa"
                  color="error"
                  size="small"
                  onClick={() => onDelete(task)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TaskCards({ tasks, onEdit, onDelete }: TaskListProps) {
  return (
    <Stack spacing={2}>
      {tasks.map((task) => (
        <Card key={task.id} elevation={1} sx={{ borderRadius: '12px' }}>
          <CardContent sx={{ pb: 0 }}>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
              {task.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {formatDate(task.date)} às {task.time}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <IconButton
              aria-label="Editar tarefa"
              color="primary"
              size="small"
              onClick={() => onEdit(task)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Excluir tarefa"
              color="error"
              size="small"
              onClick={() => onDelete(task)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  if (isMobile) {
    return <TaskCards tasks={tasks} onEdit={onEdit} onDelete={onDelete} />;
  }

  return (
    <TaskTable
      tasks={tasks}
      onEdit={onEdit}
      onDelete={onDelete}
      isTablet={isTablet}
    />
  );
}
