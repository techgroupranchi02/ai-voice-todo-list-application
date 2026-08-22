import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockUser: User;

  beforeEach(() => {
    userRepository = new UserRepository();
    
    mockUser = new User();
    mockUser.id = 1;
    mockUser.firstName = 'John';
    mockUser.lastName = 'Doe';
    mockUser.email = 'john.doe@example.com';
    mockUser.password = 'hashedPassword';
    mockUser.createdAt = new Date();
    mockUser.updatedAt = new Date();
  });

  it('should create a user successfully', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    };

    jest.spyOn(userRepository, 'save').mockImplementation(() => Promise.resolve(mockUser));

    const result = await userRepository.createUser(createUserDto);

    expect(result).toBe(mockUser);
  });

  it('should throw conflict exception when email already exists', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    };

    jest.spyOn(userRepository, 'save').mockImplementation(() => {
      const error = new Error('Unique violation');
      (error as any).code = '23505';
      return Promise.reject(error);
    });

    await expect(userRepository.createUser(createUserDto)).rejects.toThrow('An account with this email already exists.');
  });

  it('should find user by email', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementation(() => Promise.resolve(mockUser));

    const result = await userRepository.findUserByEmail('john.doe@example.com');

    expect(result).toBe(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
  });

  it('should find user by id', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementation(() => Promise.resolve(mockUser));

    const result = await userRepository.findUserById(1);

    expect(result).toBe(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update user successfully', async () => {
    const updateData = { firstName: 'Jane' };
    
    jest.spyOn(userRepository, 'findUserById').mockImplementation(() => Promise.resolve(mockUser));
    jest.spyOn(userRepository, 'save').mockImplementation(() => Promise.resolve({ ...mockUser, ...updateData }));

    const result = await userRepository.updateUser(1, updateData);

    expect(result.firstName).toBe('Jane');
  });

  it('should throw error when updating non-existent user', async () => {
    jest.spyOn(userRepository, 'findUserById').mockImplementation(() => Promise.resolve(null));

    await expect(userRepository.updateUser(999, { firstName: 'Jane' })).rejects.toThrow('User not found');
  });

  it('should delete user successfully', async () => {
    const mockResult = { affected: 1 };
    
    jest.spyOn(userRepository, 'delete').mockImplementation(() => Promise.resolve(mockResult as any));

    await expect(userRepository.deleteUser(1)).resolves.toBeUndefined();
  });

  it('should throw error when deleting non-existent user', async () => {
    const mockResult = { affected: 0 };
    
    jest.spyOn(userRepository, 'delete').mockImplementation(() => Promise.resolve(mockResult as any));

    await expect(userRepository.deleteUser(999)).rejects.toThrow('User not found');
  });
});