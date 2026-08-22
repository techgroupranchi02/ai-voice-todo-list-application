import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ userId: number; message: string }> {
    this.logger.debug('Registering new user');
    
    try {
      const user = await this.userRepository.createUser(createUserDto);
      
      this.logger.log(`User registered successfully with ID: ${user.id}`);
      
      return {
        userId: user.id,
        message: 'User registered successfully.',
      };
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.debug('Attempting user login');
    
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      this.logger.warn(`Login attempt failed for non-existent email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      this.logger.warn(`Login attempt failed for email: ${email} - Invalid password`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT tokens
    const payload = { 
      id: user.id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    this.logger.log(`User logged in successfully: ${user.id}`);
    
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.debug(`Validating user: ${email}`);
    
    const user = await this.userRepository.findUserByEmail(email);
    
    if (user && await user.comparePassword(password)) {
      this.logger.log(`User validation successful: ${user.id}`);
      return user;
    }
    
    this.logger.warn(`User validation failed for email: ${email}`);
    return null;
  }

  async getProfile(userId: number): Promise<User> {
    this.logger.debug(`Fetching profile for user ID: ${userId}`);
    
    const user = await this.userRepository.findUserById(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    this.logger.log(`Profile fetched successfully for user ID: ${userId}`);
    return user;
  }
}