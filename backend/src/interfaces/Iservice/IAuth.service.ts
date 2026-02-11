import { IUser } from '../../entity/user.entity';

export interface IAuthService {
    register(data: Partial<IUser>): Promise<{ user: IUser; token: string }>;
    login(data: Partial<IUser>): Promise<{ user: IUser; token: string }>;
}
