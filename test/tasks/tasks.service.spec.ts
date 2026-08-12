import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../src/tasks/tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../../src/tasks/entities/task.entity';
import { CreateTaskDto } from '../../src/tasks/dto/create-task.dto';
import { CreateVoiceTaskDto } from '../../src/tasks/dto/create-voice-task.dto';
import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Grocery Shopping',
        description: 'Buy milk, eggs, and bread.',
        dueDate: new Date('2024-03-15'),
        priority: 1,
        category: 'Personal',
      };

      const mockTask: any = {
        id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        ...createTaskDto,
        userId: '123',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResult = {
        taskId: mockTask.id.toString(),
      };

      jest.spyOn(taskRepository, 'create').mockReturnValue(mockTask);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(mockTask);

      expect(await service.create(createTaskDto, '123')).toEqual(mockResult);
    });

    it('should throw error if title is empty', async () => {
      const createTaskDto: CreateTaskDto = {
        title: '',
        description: 'Buy milk, eggs, and bread.',
        dueDate: new Date('2024-03-15'),
        priority: 1,
        category: 'Personal',
      };

      await expect(service.create(createTaskDto, '123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createFromVoice', () => {
    it('should create a task from voice input successfully', async () => {
      const voiceTaskDto: CreateVoiceTaskDto = {
        audioData: 'data:audio/mp3;base64,encodeddata',
      };

      const mockTask: any = {
        id: 'f1g2h3i4-j5k6-l7m8-90ab-cdefghijklmn',
        title: 'Voice Task',
        description: 'Created from voice input',
        dueDate: new Date(),
        priority: 1,
        category: 'Voice Input',
        userId: '123',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResult = {
        taskId: mockTask.id.toString(),
      };

      jest.spyOn(taskRepository, 'create').mockReturnValue(mockTask);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(mockTask);

      expect(await service.createFromVoice(voiceTaskDto, '123')).toEqual(mockResult);
    });
  });
});