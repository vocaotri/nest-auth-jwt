import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PeronalAccessTokenModule } from './peronal_access_token/personal_access_token.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, MongooseModule.forRoot(process.env.URL_DB), PeronalAccessTokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
