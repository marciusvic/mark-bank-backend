import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createTransferTransaction({
    type,
    amount,
    senderId,
    receiverId,
    reversed,
    userId,
  }: CreateTransactionDto) {
    const transaction = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type,
          amount,
          senderId,
          receiverId,
          reversed,
          createdAt: new Date(),
          userId,
        },
      }),
      this.prisma.user.update({
        where: { id: senderId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),
      this.prisma.user.update({
        where: { id: receiverId },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
    ]);
    return transaction;
  }

  async createDepositTransaction({
    type,
    amount,
    senderId,
    receiverId,
    reversed,
    userId,
  }: CreateTransactionDto) {
    const transaction = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type,
          amount,
          senderId,
          receiverId,
          reversed,
          createdAt: new Date(),
          userId,
        },
      }),
      this.prisma.user.update({
        where: { id: receiverId },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
    ]);
    return transaction;
  }

  async reverseTranferTransaction(id: string, currentTransaction: Transaction) {
    const { senderId, receiverId, amount } = currentTransaction;

    const transaction = await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id },
        data: {
          reversed: true,
          updatedAt: new Date(),
        },
      }),
      this.prisma.user.update({
        where: {
          id: senderId!,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
      this.prisma.user.update({
        where: {
          id: receiverId,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),
    ]);
    return transaction;
  }

  async reverseDepositTransaction(id: string, currentTransaction: Transaction) {
    const { receiverId, amount } = currentTransaction;
    const transaction = await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id },
        data: {
          reversed: true,
          updatedAt: new Date(),
        },
      }),
      this.prisma.user.update({
        where: {
          id: receiverId,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),
    ]);
    return transaction;
  }
  async findOne(id: string) {
    return this.prisma.transaction.findFirst({
      where: {
        id,
      },
    });
  }
  async findMany(params: { where?: Prisma.TransactionWhereInput }) {
    const { where } = params;
    return this.prisma.transaction.findMany({ where });
  }
}
