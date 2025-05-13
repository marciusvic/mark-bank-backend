import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { RolesGuard } from 'src/user/guard/roles.guard';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.transactionService.findAll({
      userId: user.id,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.transactionService.findOne(id, user.id);
  }

  @Get('allTransactions')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAllTransactions() {
    return this.transactionService.findAll();
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  reverseTransaction(@Param('id') id: string) {
    return this.transactionService.reverseTransaction(id);
  }
}
