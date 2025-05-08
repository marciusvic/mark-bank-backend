import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  password: string;
}
