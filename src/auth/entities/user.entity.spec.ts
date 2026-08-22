import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

describe('User Entity', () => {
  it('should create a user entity with valid data', () => {
    const user = new User();
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.email = 'john.doe@example.com';
    user.password = 'password123';

    expect(user).toBeInstanceOf(User);
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john.doe@example.com');
  });

  it('should hash password before saving', async () => {
    const user = new User();
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.email = 'john.doe@example.com';
    user.password = 'password123';

    // Mock the bcrypt hash function to return a known value
    jest.spyOn(require('bcryptjs'), 'hash').mockImplementation(() => Promise.resolve('$2b$10$hashedPassword'));

    await user.hashPassword();

    expect(user.password).toBe('$2b$10$hashedPassword');
    expect(require('bcryptjs').hash).toHaveBeenCalledWith('password123', 10);
  });

  it('should compare password correctly', async () => {
    const user = new User();
    user.password = '$2b$10$hashedPassword';

    jest.spyOn(require('bcryptjs'), 'compare').mockImplementation(() => Promise.resolve(true));

    const result = await user.comparePassword('password123');

    expect(result).toBe(true);
    expect(require('bcryptjs').compare).toHaveBeenCalledWith('password123', '$2b$10$hashedPassword');
  });
});