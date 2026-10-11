import { useCallback, useState } from 'react';
import { loadTasks, saveTasks } from '../services/taskStorage';
import type { Task } from '../types';

const STORAGE_ERROR_MSG =
  'Não foi possível acessar o armazenamento local. Verifique as configurações do navegador.';

function initState(): { tasks: Task[]; storageError: string | null } {
  try {
    return { tasks: loadTasks(), storageError: null };
  } catch {
    return { tasks: [], storageError: STORAGE_ERROR_MSG };
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => initState().tasks);
  const [storageError, setStorageError] = useState<string | null>(
    () => initState().storageError,
  );

  const retry = useCallback(() => {
    try {
      setTasks(loadTasks());
      setStorageError(null);
    } catch {
      setStorageError(STORAGE_ERROR_MSG);
    }
  }, []);

  const createTask = useCallback(
    (description: string, date: string, time: string) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        description,
        date,
        time,
        reminded: false,
      };
      setTasks((prev) => {
        const updated = [...prev, newTask];
        saveTasks(updated);
        return updated;
      });
    },
    [],
  );

  const updateTask = useCallback(
    (id: string, description: string, date: string, time: string) => {
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === id ? { ...t, description, date, time, reminded: false } : t,
        );
        saveTasks(updated);
        return updated;
      });
    },
    [],
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTasks(updated);
      return updated;
    });
  }, []);

  const markReminded = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, reminded: true } : t,
      );
      saveTasks(updated);
      return updated;
    });
  }, []);

  return {
    tasks,
    storageError,
    retry,
    createTask,
    updateTask,
    deleteTask,
    markReminded,
  };
}
