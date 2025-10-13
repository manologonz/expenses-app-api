import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        exists: {
            errorMessage: 'This is a required field.',
        },
        isEmail: {
            errorMessage: 'Enter a valid email.',
        },
    },
    password: {
        exists: {
            errorMessage: 'This is a required field.',
        },
        isString: {
            errorMessage: 'This field must be string.',
        },
    },
});
