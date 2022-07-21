import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { UniqueValidator } from '../validates/user_unique';
export class CreateUserDto {
    @IsNotEmpty()
    first_name: string;
    @IsNotEmpty()
    last_name: string;
    @IsEmail()
    @Validate(UniqueValidator, ['email'], {
        message: 'email already exists',
    })
    email: string;
    @IsNotEmpty()
    password: string;
    avatar?: string;
}