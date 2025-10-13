import { checkSchema } from 'express-validator';
import { emailMessage, requiredMessage } from '../messages';
import { $Enums } from '../../../../generated/prisma';

export default checkSchema({
    email: {
        exists: {
            errorMessage: requiredMessage('email'),
        },
        isEmail: {
            errorMessage: emailMessage('email'),
        },
    },
    role: {
        exists: {
            errorMessage: requiredMessage('role'),
        },
        isIn: {
            options: [[$Enums.Role.ADMINISTRATOR, $Enums.Role.USER]],
            errorMessage: 'Invalid role',
        },
    },
});
