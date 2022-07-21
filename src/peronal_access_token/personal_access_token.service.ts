import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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
}
