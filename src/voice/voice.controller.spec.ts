import { Test, TestingModule } from '@nestjs/testing';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('VoiceController', () => {
  let controller: VoiceController;
  let voiceService: VoiceService;

  const mockRequest = {
    user: { id: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoiceController],
      providers: [
        {
          provide: VoiceService,
          useValue: {
            processVoiceInput: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VoiceController>(VoiceController);
    voiceService = module.get<VoiceService>(VoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTaskFromVoice', () => {
    it('should successfully create task from voice input', async () => {
      const audioData = 'base64EncodedAudioData';
      const request = mockRequest;
      
      const mockResponse = {
        success: true,
        data: {
          taskId: 1,
          message: 'Task created from voice input successfully.',
        },
      };
      
      jest.spyOn(voiceService, 'processVoiceInput').mockResolvedValue(mockResponse);

      const result = await controller.createTaskFromVoice({ audioData }, request);

      expect(result).toEqual(mockResponse);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const audioData = 'base64EncodedAudioData';
      const request = { user: { id: 999 } };
      
      jest.spyOn(voiceService, 'processVoiceInput').mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.createTaskFromVoice({ audioData }, request)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException when processing fails', async () => {
      const audioData = 'base64EncodedAudioData';
      const request = mockRequest;
      
      jest.spyOn(voiceService, 'processVoiceInput').mockRejectedValue(new InternalServerErrorException('Processing error'));

      await expect(controller.createTaskFromVoice({ audioData }, request)).rejects.toThrow(InternalServerErrorException);
    });
  });
});