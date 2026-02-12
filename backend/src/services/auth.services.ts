import { IAuthService } from '../interfaces/Iservice/IAuth.service';
import { IUserRepo } from '../interfaces/Irepo/Iuser.repo';
import { IUser } from '../entity/user.entity';
import { hashPassword, comparePassword } from '../utils/passwordHash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import ResponseError from '../utils/responseError';
import { STATUS_CODES } from '../constants/statusCodes';

export class AuthService implements IAuthService {
    constructor(private userRepo: IUserRepo) { }

    async register(data: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        const { name, email, password } = data;

        if (!name || !email || !password) {
            throw new ResponseError('Please provide all fields', STATUS_CODES.BAD_REQUEST);
        }

        const start = Date.now();
        const existingUser = await this.userRepo.findByEmail(email);
        console.log(`[Query] findByEmail took ${Date.now() - start}ms`);

        if (existingUser) {
            throw new ResponseError('User already exists', STATUS_CODES.BAD_REQUEST);
        }

        const hashedPassword = await hashPassword(password);

        const user = await this.userRepo.create({
            name,
            email,
            password: hashedPassword,
        });

        const accessToken = generateAccessToken({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });

        return { user, accessToken, refreshToken };
    }

    async login(data: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        const { email, password } = data;

        if (!email || !password) {
            throw new ResponseError('Please provide email and password', STATUS_CODES.BAD_REQUEST);
        }

        const user = await this.userRepo.findByEmail(email);

        if (!user || !user.password) {
            throw new ResponseError('Invalid credentials', STATUS_CODES.UNAUTHORIZED);
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            throw new ResponseError('Invalid credentials', STATUS_CODES.UNAUTHORIZED);
        }

        const accessToken = generateAccessToken({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });

        return { user, accessToken, refreshToken };
    }

    async refreshToken(token: string): Promise<{ accessToken: string }> {
        if (!token) {
            throw new ResponseError('Invalid Refresh Token', STATUS_CODES.UNAUTHORIZED);
        }

        try {
            const decoded = verifyRefreshToken(token) as { id: string };

            const user = await this.userRepo.findById(decoded.id);

            if (!user) {
                throw new ResponseError('User not found', STATUS_CODES.UNAUTHORIZED);
            }

            const accessToken = generateAccessToken({ id: user._id });

            return { accessToken };
        } catch (error) {
            throw new ResponseError('Invalid Refresh Token', STATUS_CODES.UNAUTHORIZED);
        }
    }
}
