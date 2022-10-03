import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';
import { UniqueValidator } from './validates/user_unique';
import { UsersController } from './users.controller';
@Module({
  providers: [UsersService, UniqueValidator],
  exports: [UsersService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
})
export class UsersModule { }
