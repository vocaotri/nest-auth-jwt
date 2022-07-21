import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../users/user.schema';
export type PersonalAccessTokenDocument = PersonalAccessToken & mongoose.Document;
@Schema({
    timestamps: true,
})
export class PersonalAccessToken {
    @Prop({ required: true })
    token: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ required: true })
    expiration_date: Date;
}

export const PersonalAccessTokenSchema = SchemaFactory.createForClass(PersonalAccessToken);