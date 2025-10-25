import { User } from '../../../generated/prisma';
import { UserLean, UserTokenPayload } from '../../utils/types';

export default class UserMapper {
    toLeanModel(data: User | UserTokenPayload): UserLean {
        return {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            role: data.role,
            email: data.email,
            active: data.active,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }
}
