import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOne(
      { email },
      {
        password: true,
        email: true,
        name: true,
        id: true,
        role: true,
      },
    );

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  login(user: User) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: { email: string; password: string; name?: string }) {
    const userWithEmail = await this.usersService.findOne({
      email: data.email,
    });
    if (userWithEmail) {
      throw new BadRequestException({
        toast: 'Erro ao criar usuário. Tente com outro email',
        message: 'bad request',
      });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const createdUser = await this.usersService.create({
      email: data.email,
      password: hashedPassword,
      name: data.name || 'sem nome',
      role: Role.USER,
    });
    const { password: _, ...result } = createdUser;
    return result;
  }
}
