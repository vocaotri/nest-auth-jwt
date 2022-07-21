import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PeronalAccessTokenModule } from './peronal_access_token/personal_access_token.module';

@Module({
  imports: [AuthModule, UsersModule, MongooseModule.forRoot('mongodb://localhost:27017/auth_demo'), PeronalAccessTokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
