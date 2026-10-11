import { useCallback, useEffect, useRef, useState } from 'react';
import type { Task } from '../types';

/** Polls every 15 s and notifies when a task is within 60 s of its scheduled time. */
export function useReminder(
  tasks: Task[],
  markReminded: (id: string) => void,
) {
  const [queue, setQueue] = useState<Task[]>([]);

  // Use refs so checkReminders stays stable and doesn't re-trigger the effect on every render.
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;
  const markRemindedRef = useRef(markReminded);
  markRemindedRef.current = markReminded;

  const checkReminders = useCallback(() => {
    const now = Date.now();
    tasksRef.current.forEach((task) => {
      if (task.reminded) return;
      const taskMs = new Date(`${task.date}T${task.time}`).getTime();
      if (isNaN(taskMs)) return;
      if (taskMs - now <= 60_000) {
        setQueue((prev) => {
          if (prev.some((t) => t.id === task.id)) return prev;
          return [...prev, task];
        });
        markRemindedRef.current(task.id);
      }
    });
  }, []); // stable — reads latest data through refs

  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 15_000);
    return () => clearInterval(interval);
  }, [checkReminders]);

  const currentReminder = queue[0] ?? null;

  const dismissReminder = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  return { currentReminder, dismissReminder };
}
