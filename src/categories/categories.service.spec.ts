import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: any;

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      const createCategoryDto = { name: 'Personal' };
      const mockCategory = { id: 1, ...createCategoryDto };
      
      repository.create.mockReturnValue(mockCategory);
      repository.save.mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);
      
      expect(result).toEqual(mockCategory);
      expect(repository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(repository.save).toHaveBeenCalledWith(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Personal' },
        { id: 2, name: 'Work' },
      ];
      
      repository.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();
      
      expect(result).toEqual(mockCategories);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by ID', async () => {
      const mockCategory = { id: 1, name: 'Personal' };
      
      repository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne(1);
      
      expect(result).toEqual(mockCategory);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when category not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a category', async () => {
      const updateCategoryDto = { name: 'Updated Personal' };
      const mockCategory = { id: 1, ...updateCategoryDto };
      
      repository.findOne.mockResolvedValue(mockCategory);
      repository.save.mockResolvedValue(mockCategory);

      const result = await service.update(1, updateCategoryDto);
      
      expect(result).toEqual(mockCategory);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException when updating non-existent category', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, { name: 'Updated Personal' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a category successfully', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.not.toThrow();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when removing non-existent category', async () => {
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});