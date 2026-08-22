import { Test, TestingModule } from '@nestjs/testing';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

describe('VoiceController', () => {
  let controller: VoiceController;
  let mockVoiceService: Partial<VoiceService>;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTask: Task = {
    id: 1,
    userId: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: 2,
    category: 'Personal',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockVoiceService = {
      processVoiceInput: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoiceController],
      providers: [
        {
          provide: VoiceService,
          useValue: mockVoiceService,
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<VoiceController>(VoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTaskFromVoice', () => {
    it('should create a task from voice input successfully', async () => {
      const audioData = 'base64data';
      (mockVoiceService.processVoiceInput as jest.Mock).mockImplementation(() => 
        Promise.resolve(mockTask)
      );

      const request = {
        user: mockUser,
      };

      const result = await controller.createTaskFromVoice(
        { audioData },
        request
      );

      expect(result).toEqual({
        success: true,
        data: {
          taskId: mockTask.id,
          message: 'Task created from voice input successfully.',
        },
      });
      expect(mockVoiceService.processVoiceInput).toHaveBeenCalledWith(audioData, mockUser);
    });

    it('should throw error when audio data is missing', async () => {
      const request = {
        user: mockUser,
      };

      await expect(controller.createTaskFromVoice(
        { audioData: null },
        request
      )).rejects.toThrow('Audio data is required');
    });
  });
});