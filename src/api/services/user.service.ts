import { $Enums, Prisma } from '../../../generated/prisma';
import userRepository from '../repositories/user.repository';
import { GenerateTokensOpts, CustomJwtPayload, UserLean } from '../../utils/types';
import jwtUtil from '../../utils/jwt-util';

class UserService {
    createUser(data: Prisma.UserCreateInput) {
        return userRepository.createUser(data);
    }

    getAdminCount() {
        return userRepository.countUsers({ where: { role: $Enums.Role.ADMINISTRATOR } });
    }

    getUserById(userId: number) {
        return userRepository.findUserById(userId);
    }

    getUserByEmail(email: string) {
        return userRepository.findUserByEmail(email);
    }

    async generateUserAccess(userData: UserLean, opts?: GenerateTokensOpts) {
        return jwtUtil.generateTokens(userData, opts);
    }

    async checkCredentials(email: string, password: string) {
        const userData = await this.getUserByEmail(email);

        if (!userData) {
            return {
                valid: false,
                user: userData,
            };
        }

        return {
            valid: jwtUtil.checkPassword(password, userData.password),
            user: userData as UserLean,
        };
    }
}

const userService = new UserService();

export default userService;
