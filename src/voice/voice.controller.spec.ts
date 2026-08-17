// src/voice/voice.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { AuthGuard } from '../auth/auth.guard';

describe('VoiceController', () => {
  let controller: VoiceController;
  let mockVoiceService: Partial<VoiceService>;

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
      const mockAudioData = 'base64encodedaudio';
      const mockTask = { id: '123', title: 'Test Task' };
      
      (mockVoiceService.processVoiceInput as jest.Mock).mockResolvedValue(mockTask);

      const result = await controller.createTaskFromVoice(
        { audioData: mockAudioData },
        { user: { id: 1 } }
      );
      
      expect(result).toEqual({
        success: true,
        data: {
          taskId: '123',
          message: 'Task created from voice input successfully.',
        },
      });
    });

    it('should return error when audio processing fails', async () => {
      const mockAudioData = 'base64encodedaudio';
      
      (mockVoiceService.processVoiceInput as jest.Mock).mockRejectedValue(
        new Error('Processing failed')
      );

      const result = await controller.createTaskFromVoice(
        { audioData: mockAudioData },
        { user: { id: 1 } }
      );
      
      expect(result).toEqual({
        success: false,
        error: {
          message: 'Error processing the audio data.',
          statusCode: 500,
        },
      });
    });
  });
});