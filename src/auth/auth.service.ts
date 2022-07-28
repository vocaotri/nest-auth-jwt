import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.schema';
import { compare } from '../helper/hash';
import { CreatePersonalAccessTokenDto } from './../peronal_access_token/dto/create-personal_access_token.dto';
import { PeronalAccessTokenService } from './../peronal_access_token/personal_access_token.service';
import { v4 as uuidv4 } from 'uuid';
import { encryptData, decryptData } from '../helper/hash';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private peronalAccessTokenService: PeronalAccessTokenService,
        private jwtService: JwtService
    ) { }

    async validateUser(loginDto: LoginDto): Promise<User | null> {
        const user = await this.usersService.findOne(loginDto.email);
        const isMatch = await compare(loginDto.password, user.password);
        if (user && isMatch) {
            return user;
        }
        throw new UnauthorizedException();
    }

    async validateToken(tokenHash: string): Promise<User | null> {
        let tokenDecrypt = decryptData(tokenHash);
        let userAccessToken = await this.peronalAccessTokenService.findByToken(tokenDecrypt);
        if (userAccessToken && userAccessToken.user) {
            const user = userAccessToken.user;
            user.first_name = decryptData(user.first_name);
            user.last_name = decryptData(user.last_name);
            return user;
        }
        throw new UnauthorizedException();
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        const tokenMint = uuidv4();
        const tokenEncrypted = encryptData(tokenMint);
        const payload = { hash: tokenEncrypted };
        const token = this.jwtService.sign(payload);
        const tokenDecode = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const tokenExp = new Date(tokenDecode.exp * 1000);
        const createPersonalAccessTokenDto = new CreatePersonalAccessTokenDto();
        createPersonalAccessTokenDto.token = tokenMint;
        createPersonalAccessTokenDto.user = user;
        createPersonalAccessTokenDto.expiration_date = tokenExp;
        const access_token = await this.peronalAccessTokenService.create(createPersonalAccessTokenDto);
        await this.usersService.updateToken(user._id, access_token);
        return {
            access_token: token,
        };
    }

    async findByID(id: string) {
        return await this.usersService.findById(id);
    }

    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
