import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { TransactionType, User } from '@prisma/client';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { senderId, receiverId, type } = createTransactionDto;

    if (type === TransactionType.TRANSFER) {
      const sender = await this.userRepository.findOne({ id: senderId });
      if (!sender) {
        throw new Error('Remetente não encontrado');
      }
      if (senderId === receiverId) {
        throw new Error('Remetente e destinatário não podem ser iguais');
      }
      if (sender.balance < createTransactionDto.amount) {
        throw new Error('Saldo insuficiente');
      }
    }

    const receiver = await this.userRepository.findOne({ id: receiverId });
    if (!receiver) {
      throw new Error('Destinatário não encontrado');
    }

    if (type === TransactionType.TRANSFER) {
      return this.transactionRepository.createTransferTransaction({
        ...createTransactionDto,
      });
    } else {
      return this.transactionRepository.createDepositTransaction({
        ...createTransactionDto,
      });
    }
  }
  async findAll(where = {}) {
    return this.transactionRepository.findMany({ where });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionRepository.findOne(id);
    if (!transaction) {
      throw new Error('Transação não encontrada');
    }
    if (transaction.userId !== userId) {
      throw new Error('Transação não pertence ao usuário');
    }
    return transaction;
  }
  
  async reverseTransaction(id: string) {
    const currentTransaction = await this.transactionRepository.findOne(id);
    if (!currentTransaction) {
      throw new Error('Transação não encontrada');
    }
    if (currentTransaction.reversed) {
      throw new Error('Transação já revertida');
    }
    if (currentTransaction.type === TransactionType.TRANSFER) {
      if (!currentTransaction.senderId || !currentTransaction.receiverId) {
        throw new Error('Transação inválida');
      }
      return this.transactionRepository.reverseTranferTransaction(
        id,
        currentTransaction,
      );
    } else {
      return this.transactionRepository.reverseDepositTransaction(
        id,
        currentTransaction,
      );
    }
  }
}
