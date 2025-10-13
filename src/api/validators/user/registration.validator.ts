import { checkSchema, CustomValidator } from 'express-validator';
import { requiredMessage, stringMessage } from '../messages';
import { HttpError } from '../../../utils/types';
import userService from '../../services/user.service';

export const registerMatchingPasswords: CustomValidator = (input, { req }) => {
    if (input !== req.body.confirmPassword) {
        throw new HttpError({ message: "passwords don't match", statusCode: 400 });
    }
    return true;
};

const uniqueUsername: CustomValidator = async (input) => {
    const user = await userService.countUsersWithUsername(input);
    if (user > 0) {
        return Promise.reject();
    }
    return true;
};

export default checkSchema({
    firstName: {
        isString: {
            errorMessage: stringMessage('firstName'),
        },
        exists: {
            errorMessage: requiredMessage('firstName'),
        },
    },
    lastName: {
        isString: {
            errorMessage: stringMessage('lastName'),
        },
        exists: {
            errorMessage: requiredMessage('lastName'),
        },
    },
    username: {
        isString: {
            errorMessage: stringMessage('username'),
        },
        exists: {
            errorMessage: requiredMessage('username'),
        },
        custom: {
            errorMessage: 'Username already in use',
            options: uniqueUsername,
        },
    },
    password: {
        isString: {
            errorMessage: stringMessage('password'),
        },
        exists: {
            errorMessage: requiredMessage('password'),
        },
    },
    confirmPassword: {
        isString: {
            errorMessage: stringMessage('password'),
        },
        exists: {
            errorMessage: requiredMessage('password'),
        },
        custom: {
            options: registerMatchingPasswords,
            errorMessage: "Passwords don't match",
        },
    },
});
