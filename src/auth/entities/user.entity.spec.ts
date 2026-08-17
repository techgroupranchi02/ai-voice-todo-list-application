import { User } from './user.entity';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

describe('User Entity', () => {
  it('should be defined', () => {
    const user = new User();
    expect(user).toBeDefined();
  });

  it('should have correct property definitions', () => {
    const user = new User();
    
    // Check that properties exist
    expect(user.id).toBeUndefined();
    expect(user.firstName).toBeUndefined();
    expect(user.lastName).toBeUndefined();
    expect(user.email).toBeUndefined();
    expect(user.password).toBeUndefined();
    expect(user.createdAt).toBeUndefined();
    expect(user.updatedAt).toBeUndefined();
  });

  it('should validate firstName as required', () => {
    const user = new User();
    user.firstName = '';
    
    // This should fail validation
    expect(() => {
      const validator = new IsNotEmpty();
      validator.validate(user.firstName);
    }).toThrow();
  });

  it('should validate email format', () => {
    const user = new User();
    user.email = 'invalid-email';
    
    // This should fail validation
    expect(() => {
      const validator = new IsEmail();
      validator.validate(user.email);
    }).toThrow();
  });

  it('should validate password minimum length', () => {
    const user = new User();
    user.password = '123';
    
    // This should fail validation
    expect(() => {
      const validator = new MinLength(6);
      validator.validate(user.password);
    }).toThrow();
  });
});