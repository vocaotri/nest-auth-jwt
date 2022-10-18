import { ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtSocketAuthGuard extends AuthGuard('jwt-socketio') {
    constructor(private role:string = 'user'){
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        // some logic with user role           
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
