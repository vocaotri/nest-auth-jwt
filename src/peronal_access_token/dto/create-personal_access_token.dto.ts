import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/user.schema';
export class CreatePersonalAccessTokenDto {
    @IsNotEmpty()
    token: string;
    @IsNotEmpty()
    user: User;
    @IsNotEmpty()
    expiration_date: Date;
    refresh_token: string;
    refresh_expiration_date: Date;
}