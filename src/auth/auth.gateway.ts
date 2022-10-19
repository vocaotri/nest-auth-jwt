import { UseGuards } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getTokenFromClient } from 'src/helper/parseAuthHeader';
import { JwtSocketAuthGuard } from 'src/auth/jwt-socket-auth.guard';
import { verify } from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/constants';
import { AuthService } from './../auth/auth.service';
@WebSocketGateway({
    cors: {
        origin: "*", // allow for any domain
        methods: ["GET", "POST"]
    }
})
export class AuthGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(private authService: AuthService) { }

    @UseGuards(JwtSocketAuthGuard)
    handleConnection(@ConnectedSocket() client) {
        // do something when client connect
        let token = getTokenFromClient(client);
        verify(token, jwtConstants.secret, async (err, decoded) => {
            if (err) {
                client.disconnect(true);
                return;
            }
            const user = await this.authService.validateToken(decoded.hash);
            if (!user) {
                client.disconnect(true);
                return;
            }
        })
    }

    // @UseGuards(JwtSocketAuthGuard)
    // handleDisconnect(@ConnectedSocket() client) {
    //     if (client.user && client.user._id) {
    //         client.leave(client.user?._id.toString());
    //     }
    //     client.disconnect(true);
    // }

    @UseGuards(JwtSocketAuthGuard)
    @SubscribeMessage('join')
    onJoin(@ConnectedSocket() client) {
        const roomID = client.user._id.toString();
        client.join(roomID);
        return {
            error: null,
            data: {
                roomID: roomID
            }
        };
    }
}