import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Register endpoint called');
    
    try {
      const result = await this.authService.register(createUserDto);
      
      this.logger.log(`Registration successful for email: ${createUserDto.email}`);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    this.logger.log('Login endpoint called');
    
    try {
      const result = await this.authService.login(loginUserDto);
      
      this.logger.log(`Login successful for email: ${loginUserDto.email}`);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }
}