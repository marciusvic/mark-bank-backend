import { TransactionType } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  type: TransactionType;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  senderId?: string;

  @IsString()
  receiverId: string;

  @IsBoolean()
  reversed: boolean;

  @IsDate()
  createdAt: Date;

  @IsString()
  userId: string;
}
