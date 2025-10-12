import prismaClient from '../../db/index';
import { $Enums, Prisma, User } from '../../../generated/prisma/index';
import { UserLean } from '../../utils/types';

export type UpdateUserDTO = {
    firstName?: string;
    lastName?: string;
    role: $Enums.Role;
};

export class UserRepository {
    async findUserByEmail(email: string) {
        return prismaClient.user.findFirst({
            where: {
                email,
            },
        });
    }

    async findUserByUsername(username: string) {
        return prismaClient.user.findFirst({ where: { username: username } });
    }

    async findUserById(userId: number) {
        return prismaClient.user.findFirst({ where: { id: userId } });
    }

    async findAllUsers(query: Prisma.UserFindManyArgs) {
        return prismaClient.user.findMany(query);
    }

    async createUser(data: Prisma.UserCreateInput) {
        return prismaClient.user.create({ data });
    }

    async deleteUser(userId: number) {
        return prismaClient.user.delete({ where: { id: userId } });
    }

    async updateUser(userId: number, data: Prisma.UserUpdateInput) {
        return prismaClient.user.update({ where: { id: userId }, data });
    }

    async updateEmail(userId: number, email: string) {
        return prismaClient.user.update({ where: { id: userId }, data: { email } });
    }

    async countUsers(query: Prisma.UserCountArgs) {
        return prismaClient.user.count(query);
    }
}

const userRepository = new UserRepository();

export default userRepository;
