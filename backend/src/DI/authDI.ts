import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../repositories/user.repo';
import { AuthService } from '../services/auth.services';

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);

export { authController };
