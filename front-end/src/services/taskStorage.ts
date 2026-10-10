import type { Task } from '../types';

const STORAGE_KEY = 'tasks';

export function loadTasks(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  return JSON.parse(raw) as Task[];
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
