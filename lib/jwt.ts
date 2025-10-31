import * as jwt from 'jsonwebtoken';

export const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'default_secret';

export const createToken = (payload: object, expiresIn?: number) => {
    const options: jwt.SignOptions = {};
    if (expiresIn) {
        options.expiresIn = expiresIn;
    }
    return jwt.sign(payload, JWT_SECRET, options);
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
}