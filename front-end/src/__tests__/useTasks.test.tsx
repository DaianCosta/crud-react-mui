import { act, renderHook } from '@testing-library/react';
import { useTasks } from '../hooks/useTasks';
import { loadTasks, saveTasks } from '../services/taskStorage';
import type { Task } from '../types';

const EXISTING: Task = {
  id: 'abc',
  description: 'Tarefa existente',
  date: '2026-10-10',
  time: '10:00',
  reminded: false,
};

describe('useTasks', () => {
  it('AC-6: reads tasks from localStorage on initialisation', () => {
    saveTasks([EXISTING]);
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([EXISTING]);
  });

  it('AC-1: starts with empty list when localStorage is empty', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
    expect(result.current.storageError).toBeNull();
  });

  it('AC-3: createTask adds task to state and localStorage', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.createTask('Nova tarefa', '2026-11-01', '08:00');
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].description).toBe('Nova tarefa');
    expect(result.current.tasks[0].date).toBe('2026-11-01');
    expect(result.current.tasks[0].time).toBe('08:00');
    expect(result.current.tasks[0].reminded).toBe(false);
    // persisted in localStorage
    const stored = loadTasks();
    expect(stored).toHaveLength(1);
    expect(stored[0].description).toBe('Nova tarefa');
  });

  it('AC-4: updateTask changes task fields and resets reminded, persisted in localStorage', () => {
    saveTasks([{ ...EXISTING, reminded: true }]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.updateTask(EXISTING.id, 'Editada', '2026-12-01', '14:30');
    });
    expect(result.current.tasks[0].description).toBe('Editada');
    expect(result.current.tasks[0].date).toBe('2026-12-01');
    expect(result.current.tasks[0].time).toBe('14:30');
    // reminded is reset when date/time change
    expect(result.current.tasks[0].reminded).toBe(false);
    const stored = loadTasks();
    expect(stored[0].description).toBe('Editada');
  });

  it('AC-5: deleteTask removes task from state and localStorage', () => {
    saveTasks([EXISTING]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.deleteTask(EXISTING.id);
    });
    expect(result.current.tasks).toHaveLength(0);
    expect(loadTasks()).toHaveLength(0);
  });

  it('markReminded sets reminded=true in state and localStorage', () => {
    saveTasks([EXISTING]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.markReminded(EXISTING.id);
    });
    expect(result.current.tasks[0].reminded).toBe(true);
    expect(loadTasks()[0].reminded).toBe(true);
  });
});
