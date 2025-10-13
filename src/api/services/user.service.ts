import { $Enums, Prisma } from '../../../generated/prisma';
import userRepository from '../repositories/user.repository';
import { AccountActivationLean, GenerateTokensOpts, ModelResultOptions, UserLean } from '../../utils/types';
import jwtUtil from '../../utils/jwt-util';
import accountActivationRepository from '../repositories/account-activation.repository';
import { NextFunction, Request, Response } from 'express';
import inviteValidator from '../validators/authentication/invite.validator';
import { validateRequestBody } from '../../utils/helpers';
import loginValidator from '../validators/authentication/login.validator';
import crypto from 'crypto';
import registrationValidator from '../validators/user/registration.validator';
import dayjs from 'dayjs';

class UserService {
    async createUser(data: Prisma.UserCreateInput, opts?: ModelResultOptions) {
        const user = await userRepository.createUser({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: await jwtUtil.hashPassword(data.password),
            email: data.email,
            role: data.role,
            active: true,
        });

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

        const valid = await jwtUtil.checkPassword(password, userData.password);

        return {
            valid,
            user: userData as UserLean,
        };
    }

    async generateUserInvite(email: string, role: $Enums.Role, opts?: ModelResultOptions) {
        const activationToken = crypto.randomBytes(32).toString('hex');

        const exists = await accountActivationRepository.findActivationTokenByEmail(email);

        const expiration = dayjs().add(15, 'minutes').toISOString();

        if (exists) {
            await accountActivationRepository.deleteActivationTokenByEmail(email);
        }

        const invitation = await accountActivationRepository.createAccontActivationToken({
            email,
            activationToken,
            role,
            expiration,
        });

        if (opts?.lean) {
            return invitation as AccountActivationLean;
        }

        return invitation;
    }

    async countUsersWithUsername(username: string) {
        return await userRepository.countUsers({ where: { username: username } });
    }

    async inviteInputValidators(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, inviteValidator);
        next();
    }

    async loginValidator(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, loginValidator);
        next();
    }

    async userRegistrationValidators(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, registrationValidator);
        next();
    }
}

const userService = new UserService();

export default userService;
