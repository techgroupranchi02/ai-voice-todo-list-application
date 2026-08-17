import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  firstName: string;

  @IsOptional()
  @MaxLength(255)
  lastName: string;
}