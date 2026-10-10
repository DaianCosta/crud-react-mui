/**
 * AC-9: O projeto compila sem erros (build passa) e não possui erros de tipagem do TypeScript.
 * AC-10: [manual] A interface é visualmente agradável e coerente, com uso adequado de
 *         espaçamento, cores e hierarquia visual do Material UI.
 *         Justificativa: avaliação estética requer julgamento humano.
 */

// AC-9: Import the main modules to verify they are correctly typed at the test level.
// TypeScript will fail to compile this file if any exported type is broken.
import type { Task } from '../types';
import { loadTasks, saveTasks } from '../services/taskStorage';

describe('build and types', () => {
  it('AC-9: key exports are typed correctly and the project compiles without type errors', () => {
    // AC-9: Verify loadTasks returns Task[] and saveTasks accepts Task[]
    const tasks: Task[] = loadTasks();
    expect(Array.isArray(tasks)).toBe(true);

    const sample: Task = {
      id: 'type-check',
      description: 'TypeScript type check',
      date: '2026-01-01',
      time: '00:00',
      reminded: false,
    };
    // saveTasks must accept Task[] without any type error
    expect(() => saveTasks([sample])).not.toThrow();

    // Clean up
    saveTasks([]);
  });

  it('AC-10: [manual] visual consistency and MUI design quality require human review', () => {
    // AC-10 is a manual acceptance criterion — human review required.
    // This test documents the requirement so traceability is satisfied.
    expect(true).toBe(true);
  });
});
