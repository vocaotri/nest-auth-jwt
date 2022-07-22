import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { PersonalAccessToken } from "src/peronal_access_token/personal_access_token.schema";
export class UpdateUserDto extends OmitType(CreateUserDto, ['email'] as const) {
    @IsNotEmpty()
    acecess_token: PersonalAccessToken[];
}