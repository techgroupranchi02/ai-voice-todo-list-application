import { Task } from './task.entity';
import { User } from '../../auth/entities/user.entity';
import { Category } from './category.entity';

describe('Task Entity', () => {
  it('should create a task entity with valid data', () => {
    const task = new Task();
    task.id = 1;
    task.title = 'Test Task';
    task.description = 'Test Description';
    task.dueDate = new Date();
    task.priority = 1;
    task.completed = false;
    task.createdAt = new Date();
    task.updatedAt = new Date();

    expect(task).toBeInstanceOf(Task);
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('Test Description');
    expect(task.priority).toBe(1);
    expect(task.completed).toBe(false);
  });

  it('should have proper relationships with User and Category', () => {
    const task = new Task();
    const user = new User();
    const category = new Category();

    task.user = user;
    task.category = category;

    expect(task.user).toBeInstanceOf(User);
    expect(task.category).toBeInstanceOf(Category);
  });
});