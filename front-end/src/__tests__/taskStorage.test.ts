import { loadTasks, saveTasks } from '../services/taskStorage';
import type { Task } from '../types';

const SAMPLE: Task[] = [
  { id: '1', description: 'Reunião', date: '2026-10-10', time: '09:00', reminded: false },
];

describe('taskStorage', () => {
  it('loadTasks returns empty array when localStorage is empty', () => {
    // AC-1: app shows empty list initially
    expect(loadTasks()).toEqual([]);
  });

  it('saveTasks / loadTasks round-trips data — AC-3, AC-6', () => {
    saveTasks(SAMPLE);
    expect(loadTasks()).toEqual(SAMPLE);
  });

  it('saveTasks overwrites previous data — AC-4, AC-5', () => {
    saveTasks(SAMPLE);
    saveTasks([]);
    expect(loadTasks()).toEqual([]);
  });
});
