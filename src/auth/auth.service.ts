import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, Role } from '@prisma/client';
import { RolesGuard } from 'src/user/guard/roles.guard';
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

  async login(user: User) {
    const fullUser = await this.usersService.findOne(
      { id: user.id },
      {
        id: true,
        name: true,
        email: true,
        role: true,
        balance: true,
        password: false,
      },
    );
  
    if (!fullUser) {
      throw new Error('Usuário não encontrado');
    }
  
    const payload = { username: fullUser.name, sub: fullUser.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: fullUser,
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
