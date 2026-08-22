import { Task } from './task.entity';

describe('Task Entity', () => {
  it('should create a task entity instance', () => {
    const task = new Task();
    expect(task).toBeInstanceOf(Task);
  });

  it('should have required fields with default values', () => {
    const task = new Task();
    task.id = 1;
    task.userId = 1;
    task.title = 'Test Task';
    task.priority = 0;
    task.completed = false;

    expect(task.id).toBe(1);
    expect(task.userId).toBe(1);
    expect(task.title).toBe('Test Task');
    expect(task.priority).toBe(0);
    expect(task.completed).toBe(false);
  });
});