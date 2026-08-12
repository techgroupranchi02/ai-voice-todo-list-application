// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      
      const result = { id: 1, ...createUserDto };
      jest.spyOn(repository, 'create').mockReturnValue(result);
      jest.spyOn(repository, 'save').mockResolvedValue(result);
      
      expect(await service.create(createUserDto)).toBe(result);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const result = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);
      
      expect(await service.findByEmail('test@example.com')).toBe(result);
    });
  });
});