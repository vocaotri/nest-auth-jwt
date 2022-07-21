import { createCipher, createDecipher } from 'crypto';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;
var algorithm = 'aes256';
const key = 'Password used to generate key';

const encryptData = async (data: string) => {
    const cipher = createCipher(algorithm, key);
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

const decryptData = async (dataEncryoted: any) => {
    const decipher = createDecipher(algorithm, key);
    return decipher.update(dataEncryoted, 'hex', 'utf8') + decipher.final('utf8');
}

const hash = async (data: string) => {
    return await bcrypt.hash(data, saltOrRounds);
}

const compare = async (data: string, hash: string) => {
    return await bcrypt.compare(data, hash);
}

export { encryptData, decryptData, hash, compare };