import { IBaseRepo } from './Ibase.repo';
import { IUser } from '../../entity/user.entity';

export interface IUserRepo extends IBaseRepo<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}
