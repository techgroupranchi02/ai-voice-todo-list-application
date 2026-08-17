import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        throw error; // Re-throw conflict errors as they are specific
      }
      // Generic error for other cases to prevent information leakage
      throw new Error('Registration failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      // Return generic error to prevent account enumeration attacks
      throw new Error('Invalid credentials');
    }
  }
}