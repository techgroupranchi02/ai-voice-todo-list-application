import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log('Registering new user');
    
    try {
      const result = await this.authService.register(registerDto);
      
      this.logger.log(`User registered successfully: ${result.userId}`);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Registration failed:', error.message);
      
      if (error.message === 'An account with this email already exists.') {
        throw new Error('Email already exists');
      }
      
      throw new Error('Registration failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log('User attempting to login');
    
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password
      );
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const token = await this.authService.login(user);
      
      this.logger.log(`User logged in successfully: ${user.id}`);
      
      return {
        success: true,
        data: {
          ...token,
          userId: user.id.toString(),
        },
      };
    } catch (error) {
      this.logger.error('Login failed:', error.message);
      throw new Error('Invalid credentials');
    }
  }
}