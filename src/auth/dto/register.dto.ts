// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'The provided email address is invalid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @IsOptional()
  lastName?: string;
}