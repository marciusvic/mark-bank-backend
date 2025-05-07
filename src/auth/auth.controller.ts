import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'lib/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }
  @Public()
  @Get('ping')
  getPing() {
    return { message: 'pong' };
  }
}
