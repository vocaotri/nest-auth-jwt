import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ExistValidator } from '../users/validates/user_exist';
import { PeronalAccessTokenModule } from './../peronal_access_token/personal_access_token.module';
import {PeronalAccessTokenService} from './../peronal_access_token/personal_access_token.service';

@Module({
  imports: [
    UsersModule,
    PeronalAccessTokenModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, ExistValidator],
  exports: [AuthService],
})
export class AuthModule { }
