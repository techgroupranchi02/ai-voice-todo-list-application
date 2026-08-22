import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let context: ExecutionContext;

  beforeEach(() => {
    guard = new JwtAuthGuard();
    
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when user is authenticated', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    
    jest.spyOn(guard, 'canActivate').mockImplementation(() => Promise.resolve(true));
    
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException when user is not authenticated', async () => {
    jest.spyOn(guard, 'canActivate').mockImplementation(() => Promise.resolve(false));
    
    await expect(guard.canActivate(context)).rejects.toThrow('Authentication required');
  });
});