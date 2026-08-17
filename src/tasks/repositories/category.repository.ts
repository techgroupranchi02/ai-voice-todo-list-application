import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  // Custom repository methods can be added here
  // For now, we're extending the base Repository with no additional methods
  // as CRUD operations are inherited from Repository base class
}