import { Socket } from 'socket.io';
let re = /(\S+)\s+(\S+)/;
const parseAuthHeader = (hdrValue: string) => {
    if (typeof hdrValue !== 'string') {
        return null;
    }
    var matches = hdrValue.match(re);
    return matches && { scheme: matches[1], value: matches[2] };
}
const getTokenFromClient = (socket: Socket | any) => {
    var token = null;
    if (socket.handshake.headers.authorization) {
        var auth_params = parseAuthHeader(socket.handshake.headers.authorization);
        return auth_params.value;
    }
    return token;
}
export { parseAuthHeader, getTokenFromClient };