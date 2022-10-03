import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PeronalAccessTokenModule } from './peronal_access_token/personal_access_token.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, PeronalAccessTokenModule, MongooseModule.forRoot(process.env.URL_DB)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
