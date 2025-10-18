import { checkSchema } from 'express-validator';
import { arrayMessage, intMessage, requiredMessage } from '../messages';

export default checkSchema({
    expenses: {
        exists: {
            errorMessage: requiredMessage('expenses'),
        },
        isArray: {
            errorMessage: arrayMessage('expenses'),
        },
    },
    'expenses.*': {
        isInt: {
            errorMessage: intMessage('expenseId'),
        },
    },
});
