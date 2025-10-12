import { $Enums, AccountActivation, Prisma, User } from '../../../generated/prisma';
import userRepository from '../repositories/user.repository';
import { AccountActivationLean, GenerateTokensOpts, ModelResultOptions, UserLean } from '../../utils/types';
import jwtUtil from '../../utils/jwt-util';
import { v4 as uuid } from 'uuid';
import accountActivationRepository from '../repositories/account-activation.repository';

class UserService {
    async createUser(data: Prisma.UserCreateInput, opts?: ModelResultOptions) {
        const user = await userRepository.createUser(data);

        if (opts?.lean) {
            return user as UserLean;
        }

        return user;
    }

    async updateUserActiveStatus(userId: number, status: boolean) {
        return await userRepository.updateUser(userId, { active: status });
    }

    async deleteUser(userId: number, opts?: ModelResultOptions) {
        const user = await userRepository.deleteUser(userId);

        if (opts?.lean) {
            return user as UserLean;
        }

        return user;
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

    getUserByUsername(username: string) {
        return userRepository.findUserByUsername(username);
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

    async generateUserInvite(email: string, role: $Enums.Role, opts?: ModelResultOptions) {
        const activationToken = uuid();

        await accountActivationRepository.deleteActivationTokenByEmail(email);

        const invitation = await accountActivationRepository.createAccontActivationToken({
            email,
            activationToken,
            role,
        });

        if (opts?.lean) {
            return invitation as AccountActivationLean;
        }

        return invitation;
    }
}

const userService = new UserService();

export default userService;
