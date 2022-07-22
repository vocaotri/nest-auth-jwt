import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import * as mongoose from 'mongoose';
import { PersonalAccessToken } from 'src/peronal_access_token/personal_access_token.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }
    async findOne(email: string): Promise<User> {
        return this.userModel.findOne({ email: email });
    }
    async findById(id: string): Promise<User> {
        return await this.userModel.findById(id).populate('access_token');
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }
    async countDocUser(filter): Promise<Number> {
        return this.userModel.countDocuments(filter);
    }
    async updateToken(id: mongoose.Types.ObjectId, access_token: PersonalAccessToken): Promise<User> {
        let user = await this.userModel.findById(id);
        user.access_token.push(access_token);
        return await user.save();
    }
}
