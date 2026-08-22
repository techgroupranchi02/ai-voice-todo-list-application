import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a user entity instance', () => {
    const user = new User();
    expect(user).toBeInstanceOf(User);
  });

  it('should have required fields', () => {
    const user = new User();
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.email = 'john.doe@example.com';
    user.password = 'securePassword123';

    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('securePassword123');
  });
});