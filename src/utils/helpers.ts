import { Request } from 'express';
import { Result, ValidationChain, validationResult } from 'express-validator';
import { ValidationErrors, HttpError, UserLean } from './types';
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

/**
 * Converts a string into a URL-friendly slug
 * @param text - The input string to convert
 * @returns A slug with lowercase letters, numbers, and hyphens only
 */
export function textToSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
        .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export function getAuthenticatedUser(req: Request) {
    return req.state?.user as UserLean;
}
