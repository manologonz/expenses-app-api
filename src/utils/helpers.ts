import { Request } from 'express';
import { Result, ValidationChain, validationResult } from 'express-validator';
import { ValidationErrors, HttpError } from './types';
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema';

export function checkValidationErrors(result: Result) {
    const errors: ValidationErrors = {};
    if (!result.isEmpty()) {
        result.array().forEach(({ msg, path }) => {
            if (errors[path]) {
                errors[path] = [...errors[path], msg];
            } else {
                errors[path] = [msg];
            }
        });

        throw new HttpError({
            message: 'Validation Error',
            statusCode: 400,
            validationErrors: errors,
        });
    }
}

export async function validateRequestBody(req: Request, validators: RunnableValidationChains<ValidationChain>) {
    await validators.run(req);
    const result = validationResult(req);
    checkValidationErrors(result);
}
