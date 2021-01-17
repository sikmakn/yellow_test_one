import User from '../db/models/user';
import crypto from 'crypto';
import argon2 from 'argon2';

function composePasswordString(password: string, salt: string) {
    return `${password}.${process.env.STATIC_SALT}.${salt}`;
}

export async function isExist(username: string) {
    return !!await User.findOne({username});
}

export async function create(username: string, password: string) {
    const {hashedPassword, salt} = await createPassword(password);
    const user = new User({password: hashedPassword, salt, username});
    return await user.save()

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
    const user = await User.findOne({username});

    if (!user) return false;

    return await argon2.verify(user.password, composePasswordString(password, user.salt));
}


