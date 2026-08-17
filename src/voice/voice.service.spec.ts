import { Test, TestingModule } from '@nestjs/testing';
import { VoiceService } from './voice.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('VoiceService', () => {
  let service: VoiceService;
  let configService: jest.Mocked<ConfigService>;
  let httpService: jest.Mocked<HttpService>;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoiceService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<VoiceService>(VoiceService);
    configService = module.get(ConfigService);
    httpService = module.get(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processAudio', () => {
    const mockAudioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAf';
    const mockTranscript = 'Hello world this is a test';

    it('should process audio and return transcript', async () => {
      const mockResponse: AxiosResponse = {
        data: { transcript: mockTranscript },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      httpService.post.mockReturnValueOnce(of(mockResponse));

      const result = await service.processAudio(mockAudioData);

      expect(result).toEqual({ transcript: mockTranscript });
      expect(httpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/transcribe'),
        { audio: mockAudioData },
        expect.any(Object)
      );
    });

    it('should throw error when transcription fails', async () => {
      httpService.post.mockReturnValueOnce(throwError(() => new Error('Transcription failed')));

      await expect(service.processAudio(mockAudioData)).rejects.toThrow('Transcription failed');
    });
  });

  describe('extractTaskFromTranscript', () => {
    const mockTranscript = 'Create a task to finish the project by Friday';
    const mockTask = {
      title: 'Finish the project',
      dueDate: 'Friday',
      description: 'Complete all project tasks',
    };

    it('should extract task from transcript', async () => {
      const mockResponse: AxiosResponse = {
        data: { task: mockTask },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      httpService.post.mockReturnValueOnce(of(mockResponse));

      const result = await service.extractTaskFromTranscript(mockTranscript);

      expect(result).toEqual(mockTask);
      expect(httpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/extract-task'),
        { transcript: mockTranscript },
        expect.any(Object)
      );
    });

    it('should throw error when task extraction fails', async () => {
      httpService.post.mockReturnValueOnce(throwError(() => new Error('Task extraction failed')));

      await expect(service.extractTaskFromTranscript(mockTranscript)).rejects.toThrow('Task extraction failed');
    });
  });

  describe('processVoiceInput', () => {
    const mockAudioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAf';
    const mockTranscript = 'Hello world this is a test';
    const mockTask = {
      title: 'Finish the project',
      dueDate: 'Friday',
      description: 'Complete all project tasks',
    };

    it('should process voice input and return task', async () => {
      const mockTranscriptResponse: AxiosResponse = {
        data: { transcript: mockTranscript },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const mockTaskResponse: AxiosResponse = {
        data: { task: mockTask },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      httpService.post.mockReturnValueOnce(of(mockTranscriptResponse));
      httpService.post.mockReturnValueOnce(of(mockTaskResponse));

      const result = await service.processVoiceInput(mockAudioData);

      expect(result).toEqual({
        transcript: mockTranscript,
        task: mockTask,
      });
      expect(httpService.post).toHaveBeenCalledTimes(2);
    });

    it('should throw error when audio processing fails', async () => {
      httpService.post.mockReturnValueOnce(throwError(() => new Error('Audio processing failed')));

      await expect(service.processVoiceInput(mockAudioData)).rejects.toThrow('Audio processing failed');
    });
  });

  describe('validateAudioData', () => {
    it('should validate valid audio data', () => {
      const validAudioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAf';
      expect(() => service.validateAudioData(validAudioData)).not.toThrow();
    });

    it('should throw error for invalid audio data', () => {
      const invalidAudioData = 'invalid-audio-data';
      expect(() => service.validateAudioData(invalidAudioData)).toThrow('Invalid audio data format');
    });

    it('should throw error for empty audio data', () => {
      expect(() => service.validateAudioData('')).toThrow('Audio data is required');
    });
  });

  describe('calculateAudioSize', () => {
    it('should calculate correct audio size', () => {
      const audioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAf';
      const size = service.calculateAudioSize(audioData);
      expect(size).toBeGreaterThan(0);
    });

    it('should handle base64 data without prefix', () => {
      const audioData = 'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAf';
      const size = service.calculateAudioSize(audioData);
      expect(size).toBeGreaterThan(0);
    });
  });

  describe('isAudioTooLarge', () => {
    it('should return false for audio within limit', () => {
      const smallAudio = 'data:audio/wav;base64,' + 'A'.repeat(100000); // ~100KB
      expect(service.isAudioTooLarge(smallAudio)).toBe(false);
    });

    it('should return true for audio exceeding limit', () => {
      const largeAudio = 'data:audio/wav;base64,' + 'A'.repeat(10000000); // ~10MB
      expect(service.isAudioTooLarge(largeAudio)).toBe(true);
    });
  });
});