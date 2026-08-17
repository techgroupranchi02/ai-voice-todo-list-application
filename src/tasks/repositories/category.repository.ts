import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  // Custom repository methods can be added here
  // For now, we're extending the base Repository class
  // which provides all standard CRUD operations
}