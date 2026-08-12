import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    const { email, password, firstName, lastName } = registerDto;
    
    // Validate input
    if (!email || !password || !firstName || !lastName) {
      throw new Error('All fields are required');
    }
    
    return this.authService.register(email, password, firstName, lastName);
  }
}