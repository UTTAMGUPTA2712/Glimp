import * as jwt from 'jsonwebtoken';

export const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'default_secret';

export const createToken = (payload: object, expiresIn?: number) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
}