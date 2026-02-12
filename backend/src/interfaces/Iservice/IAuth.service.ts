import { IUser } from '../../entity/user.entity';

export interface IAuthService {
    register(data: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
    login(data: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
    refreshToken(token: string): Promise<{ accessToken: string }>;
}
