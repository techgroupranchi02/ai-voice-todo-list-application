import { Test } from '@nestjs/testing';
import { CategoryRepository } from './category.repository';
import { Category } from '../entities/category.entity';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('CategoryRepository', () => {
  let categoryRepository: CategoryRepository;
  let mockCategory: Category;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CategoryRepository],
    }).compile();

    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    
    mockCategory = new Category();
    mockCategory.id = 1;
    mockCategory.name = 'Personal';
  });

  describe('createCategory', () => {
    it('should create and return a new category', async () => {
      const createCategoryDto = {
        name: 'Personal',
      };

      jest.spyOn(categoryRepository, 'save').mockResolvedValue(mockCategory);

      const result = await categoryRepository.createCategory(createCategoryDto);
      expect(result).toBe(mockCategory);
    });

    it('should throw ConflictException when category name already exists', async () => {
      const createCategoryDto = {
        name: 'Personal',
      };

      jest.spyOn(categoryRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(categoryRepository.createCategory(createCategoryDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createCategoryDto = {
        name: 'Personal',
      };

      jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error('Database error'));

      await expect(categoryRepository.createCategory(createCategoryDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findCategoryById', () => {
    it('should return category by id', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory);

      const result = await categoryRepository.findCategoryById(1);
      expect(result).toBe(mockCategory);
    });

    it('should return undefined when category not found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

      const result = await categoryRepository.findCategoryById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('findAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [mockCategory];
      
      jest.spyOn(categoryRepository, 'find').mockResolvedValue(mockCategories);

      const result = await categoryRepository.findAllCategories();
      expect(result).toBe(mockCategories);
    });
  });

  describe('updateCategory', () => {
    it('should update and return category', async () => {
      const updateCategoryDto = { name: 'Work' };
      
      jest.spyOn(categoryRepository, 'findCategoryById').mockResolvedValue(mockCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue({ ...mockCategory, ...updateCategoryDto });

      const result = await categoryRepository.updateCategory(1, updateCategoryDto);
      expect(result.name).toBe('Work');
    });

    it('should throw NotFoundException when category not found', async () => {
      jest.spyOn(categoryRepository, 'findCategoryById').mockResolvedValue(undefined);

      await expect(categoryRepository.updateCategory(999, { name: 'Work' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      const mockResult = { affected: 1 };
      
      jest.spyOn(categoryRepository, 'delete').mockResolvedValue(mockResult);

      await expect(categoryRepository.deleteCategory(1)).resolves.not.toThrow();
    });

    it('should throw NotFoundException when category not found', async () => {
      const mockResult = { affected: 0 };
      
      jest.spyOn(categoryRepository, 'delete').mockResolvedValue(mockResult);

      await expect(categoryRepository.deleteCategory(999)).rejects.toThrow(NotFoundException);
    });
  });
});