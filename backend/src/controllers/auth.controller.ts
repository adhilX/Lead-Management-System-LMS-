import { NextFunction, Request, Response } from 'express';
import { IAuthService } from '../interfaces/Iservice/IAuth.service';
import { STATUS_CODES } from '../constants/statusCodes';
import { REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions } from '../utils/cookie';
import { handleControllerError } from '../utils/responseError';

export class AuthController {
    constructor(private authService: IAuthService) { }

    register = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.register(req.body);

            res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, refreshTokenCookieOptions);

            const userResponse = {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email
            };

            res.status(STATUS_CODES.CREATED).json({
                message: 'User registered successfully',
                user: userResponse
            });
        } catch (error) {
            handleControllerError(error, res, 'Register');
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.login(req.body);

            res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, refreshTokenCookieOptions);

            const userResponse = {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email
            };

            res.status(STATUS_CODES.OK).json({
                token: result.accessToken,
                user: userResponse
            });
        } catch (error) {
            handleControllerError(error, res, 'Login');
        }
    };

    refreshToken = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
            const result = await this.authService.refreshToken(refreshToken);
            res.status(STATUS_CODES.OK).json(result);
        } catch (error) {
            handleControllerError(error, res, 'Refresh Token');
        }
    };
}
