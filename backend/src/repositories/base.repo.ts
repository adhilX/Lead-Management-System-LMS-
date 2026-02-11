import { Model, Document } from 'mongoose';
import { IBaseRepo } from '../interfaces/Irepo/Ibase.repo';

export class BaseRepository<T extends Document> implements IBaseRepo<T> {
    constructor(protected readonly _model: Model<T>) { }

    async create(data: Partial<T>): Promise<T> {
        return await this._model.create(data);
    }

    async findAll(filter: any = {}, options: any = {}): Promise<T[]> {
        return await this._model.find(filter, null, options).exec();
    }

    async findById(id: string): Promise<T | null> {
        return await this._model.findById(id).exec();
    }

    async update(id: string, data: any): Promise<T | null> {
        return await this._model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this._model.findByIdAndDelete(id).exec();
        return !!result;
    }
}
