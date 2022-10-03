import { Controller, Get, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import MongooseClassSerializerInterceptor from 'src/helper/mongooseClassSerializer.interceptor';
import { User } from './user.schema';

@Controller('user')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        const auth = req.user;
        // do something with the user login
        return auth;
    }
}
