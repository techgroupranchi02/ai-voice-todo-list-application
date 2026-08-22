import { Category } from './category.entity';

describe('Category Entity', () => {
  it('should create a category entity instance', () => {
    const category = new Category();
    expect(category).toBeInstanceOf(Category);
  });

  it('should have required fields', () => {
    const category = new Category();
    category.name = 'Personal';

    expect(category.name).toBe('Personal');
  });
});