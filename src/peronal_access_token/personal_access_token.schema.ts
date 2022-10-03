import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../users/user.schema';
import { Exclude, Transform } from 'class-transformer';
export type PersonalAccessTokenDocument = PersonalAccessToken & mongoose.Document;
@Schema({
    collection: 'personal_access_tokens',
    timestamps: true,
})
export class PersonalAccessToken {
    
    @Exclude()
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true })
    token: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ required: true })
    expiration_date: Date;

    @Prop({ required: true })
    refresh_token: string;

    @Prop({ required: true })
    refresh_expiration_date: Date;

    @Prop()
    revoked_at: Date;

    @Prop()
    last_used_at: Date;
}

export const PersonalAccessTokenSchema = SchemaFactory.createForClass(PersonalAccessToken);