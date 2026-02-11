import { NextFunction, Request, Response } from 'express';
import { IAuthService } from '../interfaces/Iservice/IAuth.service';
import { STATUS_CODES } from '../constants/statusCodes';

export class AuthController {
    constructor(private authService: IAuthService) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(STATUS_CODES.CREATED).json(result);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.login(req.body);

            // Set cookie (optional, but good practice alongside token in body)
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            res.status(STATUS_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    };
}
