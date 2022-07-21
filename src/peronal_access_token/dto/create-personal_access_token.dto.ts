import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/user.schema';
export class CreatePersonalAccessTokenDto {
    @IsNotEmpty()
    token: string;
    @IsNotEmpty()
    user: User;
    @IsNotEmpty()
    expiration_date: string;
}