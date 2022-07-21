import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { PersonalAccessToken } from '../peronal_access_token/personal_access_token.schema';
import { encryptData, hash } from '../helper/hash';
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & mongoose.Document;
@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
})
export class User {
    @Exclude()
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ required: true, unique: true, set: (v: string) => v.toLowerCase() })
    email: string;

    @Prop({ required: true })
    @Exclude()
    password: string;

    @Prop({ default: false })
    is_admin: boolean;

    @Prop()
    avatar: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PersonalAccessToken' }] })
    access_token: PersonalAccessToken[];

    full_name: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('full_name').get(function (this: UserDocument) {
    return `${this.first_name} ${this.last_name}`;
});
// auto hash user info before save
UserSchema.pre('save', async function (this: UserDocument) {
    if (this.isModified('password')) {
        this.password = await hash(this.password);
    }
    if (this.isModified('first_name')) {
        this.first_name = await encryptData(this.first_name);
    }
    if (this.isModified('last_name')) {
        this.last_name = await encryptData(this.last_name);
    }
});
export { UserSchema };