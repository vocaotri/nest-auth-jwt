import { Body, Controller, Delete, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, Request, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFileSync } from 'fs';
import { formatLink } from 'src/helper/format-link';
import MongooseClassSerializerInterceptor from 'src/helper/mongooseClassSerializer.interceptor';
import { fileSize } from 'src/users/constant';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UsePipes(new ValidationPipe({ transform: true }))
    async login(@Body() LoginDto: LoginDto) {
        console.log('ok');
        return this.authService.login(LoginDto);
    }

    @Post('register')
    @UseInterceptors(FileInterceptor('avatar'))
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(@Body() createUserDto: CreateUserDto, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: fileSize.TenMb }),
            new FileTypeValidator({ fileType: 'jpeg|png|gif' })
        ]
    })) avatar: Express.Multer.File) {
        let nameFile = uuidv4() + avatar.originalname;
        writeFileSync("public/images/avatars/" + nameFile, avatar.buffer);
        let avatarURL = formatLink('images/avatars/' + nameFile);
        createUserDto.avatar = avatarURL;
        return this.authService.register(createUserDto);
    }

    @Post('refresh-token')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    async refreshToken(@Request() req, @Body('refresh_token') refreshToken: string) {
        const auth = req.user;
        return this.authService.refreshToken(auth, refreshToken);
    }

    @Delete('logout')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    async logout(@Request() req) {
        const auth = req.user;
        return this.authService.logout(auth);
    }
}
