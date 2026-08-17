import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from './category.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepository,
        {
          provide: getRepositoryToken(Category),
          useValue: {},
        },
      ],
    }).compile();

    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should extend Repository<Category>', () => {
    expect(repository).toBeInstanceOf(CategoryRepository);
  });
});