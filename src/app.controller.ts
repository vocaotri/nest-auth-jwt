import { Controller, Request, Get, Post, UseGuards, Body, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import MongooseClassSerializerInterceptor from './helper/mongooseClassSerializer.interceptor';
import { User } from './users/user.schema';
import { decryptData } from './helper/hash';
import { LoginDto } from './auth/dto/login.dto';
import { fileSize } from './users/constant';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { writeFileSync } from 'fs';
import { formatLink } from './helper/format-link';

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
  @UseInterceptors(FileInterceptor('avatar'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto, @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: fileSize.TenMb }),
      new FileTypeValidator({ fileType: 'jpeg' })
    ]
  })) avatar: Express.Multer.File) {
    let nameFile = uuidv4() + avatar.originalname;
    writeFileSync("public/images/avatars/" + nameFile, avatar.buffer);
    let avatarURL = formatLink('images/avatars/' + nameFile);
    createUserDto.avatar = avatarURL;
    return this.authService.register(createUserDto);
  }

  @Get('test-find')
  async testFind() {
    let userFind = await this.authService.findByID('62d9108251d339be3ddc6911');
    var firstNameDecrypted = decryptData(userFind.first_name);
    var lastNameDecrypted = decryptData(userFind.last_name);
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
