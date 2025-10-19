import { $Enums, Prisma } from '../../../generated/prisma';
import userRepository from '../repositories/user.repository';
import { GenerateTokensOpts, ModelFindOpts, ModelResultOptions, PaginationQuery, UserLean } from '../../utils/types';
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

    async getAllUsers(findOpts: ModelFindOpts, pagination: PaginationQuery) {
        const query: Prisma.UserFindManyArgs = {};
        query.where = {};

        if (findOpts.search) {
            query.where.OR = this.searchOnFields.map((field) => {
                return {
                    [field]: {
                        contains: findOpts.search,
                        mode: 'insensitive', // ← Add this for case-insensitive
                    },
                };
            });
        }

        const filter = this.parseFindOpts(findOpts.filter);

        if (filter) {
            query.where = {
                ...query.where,
                [filter.field]: filter.value,
            };
        }

        if (findOpts.sort) {
            const sortOpts = this.parseFindOpts(findOpts.sort);
            if (sortOpts && this.sortableFields.includes(sortOpts.field)) {
                const direction = sortOpts.value.toLowerCase();
                if (direction === 'asc' || direction === 'desc') {
                    query.orderBy = {
                        [sortOpts.field]: direction,
                    };
                }
            }
        }

        const count = await userRepository.countUsers(query as Prisma.UserCountArgs);
        query.skip = pagination.skip;
        query.take = pagination.limit;

        const data = (await userRepository.findAllUsers(query)).map(this.userMapper.toLeanModel);

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
