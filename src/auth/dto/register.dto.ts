import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}