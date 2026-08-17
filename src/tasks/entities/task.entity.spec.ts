import { Task } from './task.entity';

describe('Task Entity', () => {
  it('should be defined', () => {
    expect(new Task()).toBeDefined();
  });

  it('should have all required fields', () => {
    const task = new Task();
    
    // Check that all expected properties exist
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('userId');
    expect(task).toHaveProperty('title');
    expect(task).toHaveProperty('description');
    expect(task).toHaveProperty('dueDate');
    expect(task).toHaveProperty('priority');
    expect(task).toHaveProperty('categoryId');
    expect(task).toHaveProperty('completed');
    expect(task).toHaveProperty('createdAt');
    expect(task).toHaveProperty('updatedAt');
  });

  it('should initialize with default values', () => {
    const task = new Task();
    
    expect(task.completed).toBe(false);
    expect(task.priority).toBe(0);
  });
});