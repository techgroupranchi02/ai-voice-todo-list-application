import { User } from './user.entity';

describe('User Entity', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
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