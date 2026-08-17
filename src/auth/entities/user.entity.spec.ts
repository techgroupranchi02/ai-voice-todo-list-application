import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a user entity instance', () => {
    const user = new User();
    expect(user).toBeInstanceOf(User);
  });

  it('should have all required fields', () => {
    const user = new User();
    expect(user.id).toBeUndefined();
    expect(user.firstName).toBeUndefined();
    expect(user.lastName).toBeUndefined();
    expect(user.email).toBeUndefined();
    expect(user.password).toBeUndefined();
    expect(user.createdAt).toBeUndefined();
    expect(user.updatedAt).toBeUndefined();
  });
});