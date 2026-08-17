// src/voice/voice.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { VoiceService } from './voice.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { TasksService } from '../tasks/tasks.service';
import { of, throwError } from 'rxjs';

describe('VoiceService', () => {
  let service: VoiceService;
  let mockConfigService: Partial<ConfigService>;
  let mockHttpService: Partial<HttpService>;
  let mockTasksService: Partial<TasksService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    };

    mockHttpService = {
      post: jest.fn(),
    };

    mockTasksService = {
      create: jest.fn(),
    };

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
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    service = module.get<VoiceService>(VoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processVoiceInput', () => {
    it('should process voice input and create a task successfully', async () => {
      const mockAudioData = 'base64encodedaudio';
      const mockTranscript = 'Buy milk from the store';
      const mockTask = { id: '123', title: 'Buy milk' };
      
      (mockConfigService.get as jest.Mock).mockImplementation((key) => {
        if (key === 'OLLAMA_URL') return 'http://localhost:11434';
        if (key === 'WHISPER_MODEL') return 'tiny';
        return null;
      });
      
      (mockHttpService.post as jest.Mock).mockReturnValue(
        of({ data: { response: mockTranscript } }),
      );
      
      (mockTasksService.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await service.processVoiceInput(mockAudioData);
      
      expect(result).toEqual(mockTask);
    });

    it('should throw an error when audio processing fails', async () => {
      const mockAudioData = 'base64encodedaudio';
      
      (mockConfigService.get as jest.Mock).mockImplementation((key) => {
        if (key === 'OLLAMA_URL') return 'http://localhost:11434';
        if (key === 'WHISPER_MODEL') return 'tiny';
        return null;
      });
      
      (mockHttpService.post as jest.Mock).mockReturnValue(
        throwError(() => new Error('Transcription failed')),
      );

      await expect(service.processVoiceInput(mockAudioData)).rejects.toThrow('Error processing the audio data.');
    });
  });

  describe('transcribeAudio', () => {
    it('should transcribe audio successfully', async () => {
      const mockBuffer = Buffer.from('audio');
      const mockTranscript = 'This is a test transcription';
      
      (mockConfigService.get as jest.Mock).mockImplementation((key) => {
        if (key === 'OLLAMA_URL') return 'http://localhost:11434';
        if (key === 'WHISPER_MODEL') return 'tiny';
        return null;
      });
      
      (mockHttpService.post as jest.Mock).mockReturnValue(
        of({ data: { response: mockTranscript } }),
      );

      const result = await service['transcribeAudio'](mockBuffer);
      
      expect(result).toEqual(mockTranscript);
    });

    it('should throw an error when transcription fails', async () => {
      const mockBuffer = Buffer.from('audio');
      
      (mockConfigService.get as jest.Mock).mockImplementation((key) => {
        if (key === 'OLLAMA_URL') return 'http://localhost:11434';
        if (key === 'WHISPER_MODEL') return 'tiny';
        return null;
      });
      
      (mockHttpService.post as jest.Mock).mockReturnValue(
        throwError(() => new Error('Transcription failed')),
      );

      await expect(service['transcribeAudio'](mockBuffer)).rejects.toThrow('Error processing the audio data.');
    });
  });

  describe('extractTaskDetails', () => {
    it('should extract task details from transcript', () => {
      const transcript = 'Complete the project by Friday. It is urgent.';
      
      const result = service['extractTaskDetails'](transcript);
      
      expect(result.title).toBe('Complete the project by Friday');
      expect(result.priority).toBe(1); // Urgent
    });

    it('should extract category from transcript', () => {
      const transcript = 'Buy groceries for the week';
      
      const result = service['extractTaskDetails'](transcript);
      
      expect(result.category).toBe('Shopping');
    });
  });
});