import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
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
            await this.peronalAccessTokenService.updateLastUsed(userAccessToken._id);
            user.current_access_token_id = userAccessToken._id;
            return user;
        }
        throw new UnauthorizedException();
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        if (!(process.env.MULTIPLE_LOGIN === 'true')) {
            await this.peronalAccessTokenService.revokeTokenByUserId(user._id);
        }
        const { tokenMint, tokenRefreshMint, tokenRefreshEncrypted, token, tokenExp, tokenRefreshExp } = this.generateToken();
        const createPersonalAccessTokenDto = new CreatePersonalAccessTokenDto();
        createPersonalAccessTokenDto.token = tokenMint;
        createPersonalAccessTokenDto.user = user;
        createPersonalAccessTokenDto.expiration_date = tokenExp;
        createPersonalAccessTokenDto.refresh_token = tokenRefreshMint;
        createPersonalAccessTokenDto.refresh_expiration_date = tokenRefreshExp;
        const access_token = await this.peronalAccessTokenService.create(createPersonalAccessTokenDto);
        await this.usersService.updateToken(user._id, access_token);
        return {
            access_token: token,
            expiration_date: access_token.expiration_date,
            refresh_token: tokenRefreshEncrypted,
            refresh_expiration_date: access_token.refresh_expiration_date
        };
    }

    async logout(user: User) {
        if (process.env.MULTIPLE_LOGIN === 'true') {
            await this.peronalAccessTokenService.revokeTokenById(user.current_access_token_id);
        } else {
            await this.peronalAccessTokenService.revokeTokenByUserId(user._id);
        }
        return {
            message: 'Logout success'
        };
    }

    async refreshToken(user: User, refreshToken: string) {
        try {
            const tokenDecrypt = decryptData(refreshToken);
            const findRefeshToken = await this.peronalAccessTokenService.findByRefreshToken(tokenDecrypt);
            if (findRefeshToken && findRefeshToken.user._id.toString() === user._id.toString()) {
                const { tokenMint, tokenRefreshMint, tokenRefreshEncrypted, token, tokenExp, tokenRefreshExp } = this.generateToken();
                const createPersonalAccessTokenDto = new CreatePersonalAccessTokenDto();
                createPersonalAccessTokenDto.token = tokenMint;
                createPersonalAccessTokenDto.user = user;
                createPersonalAccessTokenDto.expiration_date = tokenExp;
                createPersonalAccessTokenDto.refresh_token = tokenRefreshMint;
                createPersonalAccessTokenDto.refresh_expiration_date = tokenRefreshExp;
                await this.peronalAccessTokenService.updateById(findRefeshToken._id, createPersonalAccessTokenDto);
                return {
                    access_token: token,
                    expiration_date: findRefeshToken.expiration_date,
                    refresh_token: tokenRefreshEncrypted,
                    refresh_expiration_date: findRefeshToken.refresh_expiration_date
                };
            }
            throw new HttpException(
                'Invalid refresh token',
                400
            );
        } catch (e) {
            console.log(e);
            throw new HttpException(
                'Invalid refresh token',
                400
            );
        }
    }

    async findByID(id: string) {
        return await this.usersService.findById(id);
    }

    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    generateToken() {
        const tokenMint = uuidv4();
        const tokenEncrypted = encryptData(tokenMint);
        const tokenRefreshMint = uuidv4();
        const tokenRefreshEncrypted = encryptData(tokenRefreshMint);
        const payload = { hash: tokenEncrypted };
        const token = this.jwtService.sign(payload);
        const tokenDecode = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const tokenExp = new Date(tokenDecode.exp * 1000);
        // tokenRefreshExp greater than tokenExp 7 days
        const tokenRefreshExp = new Date(tokenExp.getTime() + 7 * 24 * 60 * 60 * 1000);
        return {
            tokenMint: tokenMint,
            tokenEncrypted: tokenEncrypted,
            tokenRefreshMint: tokenRefreshMint,
            tokenRefreshEncrypted: tokenRefreshEncrypted,
            payload: payload,
            token: token,
            tokenDecode: tokenDecode,
            tokenExp: tokenExp,
            tokenRefreshExp: tokenRefreshExp
        }
    }
}
