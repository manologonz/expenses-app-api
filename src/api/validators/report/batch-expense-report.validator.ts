import { checkSchema, CustomValidator } from 'express-validator';
import { arrayMessage, emptyArrayMessage, intMessage, requiredMessage } from '../messages';

const emptyArray: CustomValidator = (input) => {
    return input?.length > 0;
};

export default checkSchema({
    expenses: {
        exists: {
            bail: true,
            errorMessage: requiredMessage('expenses'),
        },
        isArray: {
            bail: true,
            errorMessage: arrayMessage('expenses'),
        },
        custom: {
            bail: true,
            options: emptyArray,
            errorMessage: emptyArrayMessage('expenses'),
        },
    },
    'expenses.*': {
        isInt: {
            bail: true,
            errorMessage: intMessage('expenseId'),
        },
    },
});
