import { Category } from './category.entity';

describe('Category Entity', () => {
  it('should be defined', () => {
    expect(new Category()).toBeDefined();
  });

  it('should have required fields', () => {
    const category = new Category();
    expect(category.id).toBeUndefined();
    expect(category.name).toBeUndefined();
    expect(category.created_at).toBeUndefined();
    expect(category.updated_at).toBeUndefined();
  });
});