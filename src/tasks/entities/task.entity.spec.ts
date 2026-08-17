import { Task } from './task.entity';

describe('Task Entity', () => {
  it('should create a task entity instance', () => {
    const task = new Task();
    expect(task).toBeInstanceOf(Task);
  });

  it('should have correct properties', () => {
    const task = new Task();
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('user');
    expect(task).toHaveProperty('title');
    expect(task).toHaveProperty('description');
    expect(task).toHaveProperty('dueDate');
    expect(task).toHaveProperty('priority');
    expect(task).toHaveProperty('category');
    expect(task).toHaveProperty('completed');
    expect(task).toHaveProperty('createdAt');
    expect(task).toHaveProperty('updatedAt');
  });
});