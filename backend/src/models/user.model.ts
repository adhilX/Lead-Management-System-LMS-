import mongoose, { Schema } from 'mongoose';
import { IUser } from '../entity/user.entity';

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
