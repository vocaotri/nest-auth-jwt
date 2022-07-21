import { Controller, Request, Get, Post, UseGuards, Body, UsePipes, ValidationPipe, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import MongooseClassSerializerInterceptor from './helper/mongooseClassSerializer.interceptor';
import { User } from './users/user.schema';
import { decryptData } from './helper/hash';
import { LoginDto } from './auth/dto/login.dto';

@UseInterceptors(MongooseClassSerializerInterceptor(User))
@Controller()
export class AppController {
  constructor(private authService: AuthService) { }

  @Post('auth/login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @Post('auth/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('test-find')
  async testFind() {
    let userFind = await this.authService.findByID('62d9108251d339be3ddc6911');
    var firstNameDecrypted = await decryptData(userFind.first_name);
    var lastNameDecrypted = await decryptData(userFind.last_name);
    userFind.first_name = firstNameDecrypted;
    userFind.last_name = lastNameDecrypted;
    userFind.full_name = firstNameDecrypted + ' ' + lastNameDecrypted;
    return userFind;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
