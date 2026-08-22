import { TaskRepository } from './task.repository';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let mockTask: Task;

  beforeEach(() => {
    taskRepository = new TaskRepository();
    
    mockTask = new Task();
    mockTask.id = 1;
    mockTask.title = 'Test Task';
    mockTask.description = 'Test Description';
    mockTask.dueDate = new Date();
    mockTask.priority = 1;
    mockTask.completed = false;
    mockTask.createdAt = new Date();
    mockTask.updatedAt = new Date();
  });

  it('should create a task successfully', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
      categoryId: 1,
      userId: 1
    };

    jest.spyOn(taskRepository, 'save').mockImplementation(() => Promise.resolve(mockTask));

    const result = await taskRepository.createTask(createTaskDto);

    expect(result).toBe(mockTask);
  });

  it('should throw conflict exception when constraint violation occurs', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
      categoryId: 1,
      userId: 1
    };

    jest.spyOn(taskRepository, 'save').mockImplementation(() => {
      const error = new Error('Unique violation');
      (error as any).code = '23505';
      return Promise.reject(error);
    });

    await expect(taskRepository.createTask(createTaskDto)).rejects.toThrow('Task creation failed due to constraint violation');
  });

  it('should find task by id', async () => {
    jest.spyOn(taskRepository, 'findOne').mockImplementation(() => Promise.resolve(mockTask));

    const result = await taskRepository.findTaskById(1);

    expect(result).toBe(mockTask);
    expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update task successfully', async () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description'
    };
    
    jest.spyOn(taskRepository, 'findTaskById').mockImplementation(() => Promise.resolve(mockTask));
    jest.spyOn(taskRepository, 'save').mockImplementation(() => Promise.resolve({ ...mockTask, ...updateTaskDto }));

    const result = await taskRepository.updateTask(1, updateTaskDto);

    expect(result.title).toBe('Updated Task');
  });

  it('should throw error when updating non-existent task', async () => {
    jest.spyOn(taskRepository, 'findTaskById').mockImplementation(() => Promise.resolve(null));

    await expect(taskRepository.updateTask(999, { title: 'Updated Task' })).rejects.toThrow('Task not found');
  });

  it('should delete task successfully', async () => {
    const mockResult = { affected: 1 };
    
    jest.spyOn(taskRepository, 'delete').mockImplementation(() => Promise.resolve(mockResult as any));

    await expect(taskRepository.deleteTask(1)).resolves.toBeUndefined();
  });

  it('should throw error when deleting non-existent task', async () => {
    const mockResult = { affected: 0 };
    
    jest.spyOn(taskRepository, 'delete').mockImplementation(() => Promise.resolve(mockResult as any));

    await expect(taskRepository.deleteTask(999)).rejects.toThrow('Task not found');
  });

  it('should find tasks by user id', async () => {
    const mockTasks = [mockTask];
    
    jest.spyOn(taskRepository, 'find').mockImplementation(() => Promise.resolve(mockTasks));

    const result = await taskRepository.findTasksByUserId(1);

    expect(result).toBe(mockTasks);
    expect(taskRepository.find).toHaveBeenCalledWith({ where: { userId: 1 } });
  });

  it('should find completed tasks by user id', async () => {
    const mockTasks = [mockTask];
    
    jest.spyOn(taskRepository, 'find').mockImplementation(() => Promise.resolve(mockTasks));

    const result = await taskRepository.findCompletedTasksByUserId(1);

    expect(result).toBe(mockTasks);
    expect(taskRepository.find).toHaveBeenCalledWith({ 
      where: { 
        userId: 1, 
        completed: true 
      } 
    });
  });

  it('should find pending tasks by user id', async () => {
    const mockTasks = [mockTask];
    
    jest.spyOn(taskRepository, 'find').mockImplementation(() => Promise.resolve(mockTasks));

    const result = await taskRepository.findPendingTasksByUserId(1);

    expect(result).toBe(mockTasks);
    expect(taskRepository.find).toHaveBeenCalledWith({ 
      where: { 
        userId: 1, 
        completed: false 
      } 
    });
  });
});