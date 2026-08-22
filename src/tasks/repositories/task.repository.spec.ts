import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { Task } from '../entities/task.entity';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let mockTask: Task;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TaskRepository],
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    
    mockTask = new Task();
    mockTask.id = 1;
    mockTask.userId = 1;
    mockTask.title = 'Test Task';
    mockTask.description = 'Test Description';
    mockTask.priority = 0;
    mockTask.completed = false;
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const createTaskDto = {
        userId: 1,
        title: 'Test Task',
        description: 'Test Description',
        priority: 0,
      };

      jest.spyOn(taskRepository, 'save').mockResolvedValue(mockTask);

      const result