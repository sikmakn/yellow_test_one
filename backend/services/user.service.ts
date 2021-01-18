import * as userRepository from '../repositories/user.repository';
import crypto from 'crypto';
import argon2 from 'argon2';

function composePasswordString(password: string, salt: string) {
    return `${password}.${process.env.STATIC_SALT}.${salt}`;
}

export function isExist(username: string) {
    return userRepository.isExist(username);
}

export async function create(username: string, password: string) {
    const {hashedPassword, salt} = await createPassword(password);
    return await userRepository.create(username, hashedPassword, salt);

    async function createPassword(password: string) {
        const dynamicSalt = makeRandomString();
        const saltedPassword = composePasswordString(password, dynamicSalt);
        const hashedPassword = await argon2.hash(saltedPassword);
        return {hashedPassword, salt: dynamicSalt};

        function makeRandomString() {
            return crypto.randomBytes(128).toString('base64');
        }
    }
}

export async function validate(username: string, password: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) return false;

    return await argon2.verify(user.password, composePasswordString(password, user.salt));
}


