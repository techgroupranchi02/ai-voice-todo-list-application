import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;

    const category = new Category();
    category.name = name;

    try {
      return await category.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Category with this name already exists');
      } else {
        throw new InternalServerErrorException('Error creating category');
      }
    }
  }

  async findCategoryById(id: number): Promise<Category> {
    return await this.findOne({ where: { id } });
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.find();
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findCategoryById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, updateCategoryDto);
    
    try {
      return await category.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Category with this name already exists');
      } else {
        throw new InternalServerErrorException('Error updating category');
      }
    }
  }

  async deleteCategory(id: number): Promise<void> {
    const result = await this.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }
}