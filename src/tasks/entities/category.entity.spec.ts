import { Category } from './category.entity';
import { validate } from 'class-validator';

describe('Category Entity', () => {
  it('should create a valid category entity', async () => {
    const category = new Category();
    category.name = 'Personal';
    
    const errors = await validate(category);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when name is empty', async () => {
    const category = new Category();
    category.name = '';
    
    const errors = await validate(category);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation when name is not a string', async () => {
    const category = new Category() as any;
    category.name = 123;
    
    const errors = await validate(category);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });
});