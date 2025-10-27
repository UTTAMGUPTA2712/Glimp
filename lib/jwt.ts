import * as jwt from 'jsonwebtoken';

export const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'default_secret';

export const createToken = (payload: object, expiresIn?: number) => {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    return token;
}

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}