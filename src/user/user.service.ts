import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findAll(params: { where?: Prisma.UserWhereInput } = {}) {
    return this.usersRepository.findMany(params);
  }

  async findOne(
    UserUniqueInput: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ) {
    return this.usersRepository.findOne(UserUniqueInput, select);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.usersRepository.delete({
      where: { id },
    });
  }
}
