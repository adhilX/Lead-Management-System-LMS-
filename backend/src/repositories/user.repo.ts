import { BaseRepository } from './base.repo';
import { IUser } from '../entity/user.entity';
import { IUserRepo } from '../interfaces/Irepo/Iuser.repo';
import User from '../models/user.model';

export class UserRepository extends BaseRepository<IUser> implements IUserRepo {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await this._model.findOne({ email }).exec();
    }
}
