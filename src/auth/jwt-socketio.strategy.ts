import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { getTokenFromClient } from 'src/helper/parseAuthHeader';

@Injectable()
export class JwtSocketIoStrategy extends PassportStrategy(Strategy, 'jwt-socketio') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: getTokenFromClient,
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        return await this.authService.validateToken(payload.hash);
    }
}