import { sign, verify } from "jsonwebtoken";

export const generateAccessToken = (payload: object): string => {
    return sign(payload, process.env.JWT_SECRET as string, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: object): string => {
    return sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): object | string => {
    return verify(token, process.env.JWT_SECRET as string);
};

export const verifyRefreshToken = (token: string): object | string => {
    return verify(token, process.env.JWT_REFRESH_SECRET as string);
};