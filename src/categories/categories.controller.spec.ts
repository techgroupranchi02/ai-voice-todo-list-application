import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category and return success response', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Personal' };
      const mockCategory = { id: 1, ...createCategoryDto };
      
      mockCategoriesService.create.mockResolvedValue(mockCategory);

      const result = await controller.create(createCategoryDto);
      
      expect(result).toEqual({
        success: true,
        data: mockCategory,
      });
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return all categories and return success response', async () => {
      const mockCategories = [
        { id: 1, name: 'Personal' },
        { id: 2, name: 'Work' },
      ];
      
      mockCategoriesService.findAll.mockResolvedValue(mockCategories);

      const result = await controller.findAll();
      
      expect(result).toEqual({
        success: true,
        data: mockCategories,
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category and return success response', async () => {
      const mockCategory = { id: 1, name: 'Personal' };
      
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);

      const result = await controller.findOne(1);
      
      expect(result).toEqual({
        success: true,
        data: mockCategory,
      });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockCategoriesService.findOne.mockRejectedValue(
        new NotFoundException('Category with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a category and return success response', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Personal' };
      const mockCategory = { id: 1, ...updateCategoryDto };
      
      mockCategoriesService.update.mockResolvedValue(mockCategory);

      const result = await controller.update(1, updateCategoryDto);
      
      expect(result).toEqual({
        success: true,
        data: mockCategory,
      });
      expect(service.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });

    it('should throw NotFoundException when updating non-existent category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Personal' };
      
      mockCategoriesService.update.mockRejectedValue(
        new NotFoundException('Category with ID 999 not found'),
      );

      await expect(controller.update(999, updateCategoryDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category and return success response', async () => {
      mockCategoriesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);
      
      expect(result).toEqual({
        success: true,
        message: 'Category deleted successfully',
      });
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when removing non-existent category', async () => {
      mockCategoriesService.remove.mockRejectedValue(
        new NotFoundException('Category with ID 999 not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});