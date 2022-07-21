import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { ExistValidator } from '../../users/validates/user_exist';
export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @Validate(ExistValidator, ['email'], {
        message: 'email not exists',
    })
    email: string;
    @IsNotEmpty()
    password: string;
}