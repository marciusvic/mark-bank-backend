import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findMany(params: { where?: Prisma.UserWhereInput }) {
    const { where } = params;
    return this.prisma.user.findMany({
      where,
    });
  }

  async findOne(
    UserUniqueInput: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ) {
    return this.prisma.user.findUnique({
      where: UserUniqueInput,
      select,
    });
  }
  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.user.update({
      where,
      data,
    });
  }
  async delete(params: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.user.delete({
      where,
    });
  }
}
