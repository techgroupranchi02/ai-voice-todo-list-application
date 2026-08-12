import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      // Remove password from returned user object
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, firstName: string, lastName: string) {
    // Check if user already exists
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('An account with this email already exists.');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    
    return {
      userId: newUser.id,
      message: 'User registered successfully.',
    };
  }
}