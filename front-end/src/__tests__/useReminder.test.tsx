import { act, renderHook, waitFor } from '@testing-library/react';
import { useReminder } from '../hooks/useReminder';
import type { Task } from '../types';

// Fixed point in time: 2026-10-10 10:00:00 UTC
const FIXED_NOW = new Date('2026-10-10T10:00:00').getTime();

describe('useReminder', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('AC-7: triggers reminder immediately when task is within 60 seconds of its time', async () => {
    // Task scheduled at exactly "now": diff = 0 ms ≤ 60 000 ms → reminder fires
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);

    const task: Task = {
      id: '1',
      description: 'Reunião urgente',
      date: '2026-10-10',
      time: '10:00',
      reminded: false,
    };
    const markReminded = vi.fn();

    const { result } = renderHook(() => useReminder([task], markReminded));

    await waitFor(() => {
      expect(result.current.currentReminder).not.toBeNull();
    });

    expect(result.current.currentReminder?.id).toBe('1');
    expect(markReminded).toHaveBeenCalledWith('1');
  });

  it('AC-7: does not trigger reminder for task more than 60 seconds away', async () => {
    // Task at 10:05 — 5 minutes (300 000 ms) in the future
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);

    const task: Task = {
      id: '2',
      description: 'Tarefa futura',
      date: '2026-10-10',
      time: '10:05',
      reminded: false,
    };
    const markReminded = vi.fn();

    const { result } = renderHook(() => useReminder([task], markReminded));

    // Give the initial check a chance to run
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.currentReminder).toBeNull();
    expect(markReminded).not.toHaveBeenCalled();
  });

  it('AC-7: does not trigger reminder for already reminded task', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);

    const task: Task = {
      id: '3',
      description: 'Já notificada',
      date: '2026-10-10',
      time: '10:00',
      reminded: true, // already reminded
    };
    const markReminded = vi.fn();

    const { result } = renderHook(() => useReminder([task], markReminded));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.currentReminder).toBeNull();
    expect(markReminded).not.toHaveBeenCalled();
  });

  it('AC-7: dismissReminder removes the current reminder from queue', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);

    const task: Task = {
      id: '4',
      description: 'Dismissível',
      date: '2026-10-10',
      time: '10:00',
      reminded: false,
    };
    const markReminded = vi.fn();

    const { result } = renderHook(() => useReminder([task], markReminded));

    await waitFor(() => {
      expect(result.current.currentReminder).not.toBeNull();
    });

    act(() => {
      result.current.dismissReminder();
    });

    expect(result.current.currentReminder).toBeNull();
  });

  it('AC-7: triggers reminder on page open for past tasks (time already passed)', async () => {
    // Task was at 09:59 — 1 minute before "now" (10:00): diff = -60 000 ms ≤ 60 000 ms
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);

    const task: Task = {
      id: '5',
      description: 'Tarefa passada',
      date: '2026-10-10',
      time: '09:59',
      reminded: false,
    };
    const markReminded = vi.fn();

    const { result } = renderHook(() => useReminder([task], markReminded));

    await waitFor(() => {
      expect(result.current.currentReminder).not.toBeNull();
    });

    expect(markReminded).toHaveBeenCalledWith('5');
  });
});
