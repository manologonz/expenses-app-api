import { $Enums, Prisma } from '../../../generated/prisma';
import userRepository from '../repositories/user.repository';
import { GenerateTokensOpts, ModelResultOptions, PaginationQuery, UserLean, UserQueryArgs } from '../../utils/types';
import jwtUtil from '../../utils/jwt-util';
import accountActivationRepository from '../repositories/account-activation.repository';
import { NextFunction, Request, Response } from 'express';
import inviteValidator from '../validators/authentication/invite.validator';
import { validateRequestBody } from '../../utils/helpers';
import loginValidator from '../validators/authentication/login.validator';
import crypto from 'crypto';
import registrationValidator from '../validators/user/registration.validator';
import dayjs from 'dayjs';
import Pagination from '../../utils/pagination';
import { BaseService } from './base-service.service';
import UserMapper from '../mappers/user.mapper';
import AccountActivationMapper from '../mappers/user-activation.mapper';

class UserService extends BaseService {
    pagination: Pagination;
    userMapper: UserMapper;
    accountActivationMapper: AccountActivationMapper;

    constructor() {
        super(
            ['username', 'firstName', 'lastName', 'email'],
            ['role'],
            ['username', 'firstName', 'lastName', 'role', 'id'],
        );
        this.pagination = new Pagination();
        this.userMapper = new UserMapper();
        this.accountActivationMapper = new AccountActivationMapper();
    }

    async getAllUsers(findOpts: UserQueryArgs, pagination: PaginationQuery) {
        let whereQuery: Prisma.UserWhereInput = {};

        const searchQuery = this.parseSearchQuery<Prisma.UserWhereInput>(findOpts.search);
        const sortQuery = this.parseSortQuery(findOpts.sort);

        if (searchQuery) {
            whereQuery = {
                ...whereQuery,
                OR: searchQuery,
            };
        }

        if (
            findOpts.role &&
            [$Enums.Role.ADMINISTRATOR as string, $Enums.Role.USER as string].includes(findOpts?.role)
        ) {
            whereQuery = {
                ...whereQuery,
                role: findOpts.role as $Enums.Role,
            };
        }

        const count = await userRepository.countUsers({ where: whereQuery });

        const data = (
            await userRepository.findAllUsers({
                where: whereQuery,
                skip: pagination.skip,
                take: pagination.limit,
                orderBy: { [sortQuery.field]: sortQuery.value },
            })
        ).map(this.userMapper.toLeanModel);

        return {
            data,
            count,
        };
    }

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
            return this.userMapper.toLeanModel(user);
        }

        return user;
    }

    async updateUserActiveStatus(userId: number, status: boolean) {
        return await userRepository.updateUser(userId, { active: status });
    }

    async deleteUser(userId: number, opts?: ModelResultOptions) {
        const user = await userRepository.deleteUser(userId);

        if (opts?.lean) {
            return this.userMapper.toLeanModel(user);
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
            user: this.userMapper.toLeanModel(userData),
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
            return this.accountActivationMapper.toLeanModel(invitation);
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
