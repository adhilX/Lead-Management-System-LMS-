import { NextFunction, Request, Response } from 'express';
import { IAuthService } from '../interfaces/Iservice/IAuth.service';
import { STATUS_CODES } from '../constants/statusCodes';
import { REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions } from '../utils/cookie';

export class AuthController {
    constructor(private authService: IAuthService) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.register(req.body);

            res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, refreshTokenCookieOptions);

            res.status(STATUS_CODES.CREATED).json({ user: result.user, token: result.accessToken });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.login(req.body);

            res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, refreshTokenCookieOptions);

            res.status(STATUS_CODES.OK).json({ user: result.user, token: result.accessToken });
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
            const result = await this.authService.refreshToken(refreshToken);
            res.status(STATUS_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    };
}
