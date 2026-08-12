import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error.message === 'Email already exists') {
        return {
          success: false,
          error: {
            code: HttpStatus.CONFLICT,
            message: 'An account with this email already exists.',
          },
        };
      }
      
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return {
          success: false,
          error: {
            code: HttpStatus.UNAUTHORIZED,
            message: 'Invalid email or password.',
          },
        };
      }
      
      throw error;
    }
  }
}