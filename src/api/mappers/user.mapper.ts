import { User } from '../../../generated/prisma';
import { UserLean } from '../../utils/types';

export default class UserMapper {
    toLeanModel(data: User): UserLean {
        return {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            role: data.role,
            email: data.email,
            active: data.active,
        };
    }
}
