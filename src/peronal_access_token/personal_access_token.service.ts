import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PersonalAccessToken, PersonalAccessTokenDocument } from './personal_access_token.schema';
import { CreatePersonalAccessTokenDto } from './dto/create-personal_access_token.dto';

@Injectable()
export class PeronalAccessTokenService {
    constructor(@InjectModel(PersonalAccessToken.name) private readonly personalAccessTokenModel: Model<PersonalAccessTokenDocument>) { }
    async create(createPersonalAccessTokenDto: CreatePersonalAccessTokenDto): Promise<PersonalAccessToken> {
        const createdPersonalAccessToken = new this.personalAccessTokenModel(createPersonalAccessTokenDto);
        return createdPersonalAccessToken.save();
    }
    async findByToken(token: string): Promise<PersonalAccessToken | null> {
        return await this.personalAccessTokenModel.findOne({
            token: token,
            expiration_date: { $gte: new Date() },
            revoked_at: null
        }).populate('user');
    }

    async revokeTokenById(id: mongoose.Types.ObjectId) {
        // soft delete
        return await this.personalAccessTokenModel.findByIdAndUpdate(
            id, { revoked_at: new Date() });
        // hard delete
        // return await this.personalAccessTokenModel.findByIdAndDelete(id);
    }

    async revokeTokenByUserId(userId: mongoose.Types.ObjectId) {
        // soft delete
        return await this.personalAccessTokenModel.updateMany(
            { user: userId, revoked_at: null }, { revoked_at: new Date() });
        // hard delete
        // return await this.personalAccessTokenModel.deleteMany({ user: userId });
    }

    async findByRefreshToken(refreshToken: string): Promise<PersonalAccessToken | null> {
        return await this.personalAccessTokenModel.findOne({
            refresh_token: refreshToken,
            refresh_expiration_date: { $gte: new Date() }
        }).populate('user');
    }

    async updateById(id: mongoose.Types.ObjectId, createPersonalAccessTokenDto: CreatePersonalAccessTokenDto) {
        return await this.personalAccessTokenModel.findByIdAndUpdate(
            id, createPersonalAccessTokenDto, { upsert: true });
    }

    async updateLastUsed(id: mongoose.Types.ObjectId) {
        return await this.personalAccessTokenModel.findByIdAndUpdate(
            id, { last_used_at: new Date() }, { upsert: true });
    }
}
