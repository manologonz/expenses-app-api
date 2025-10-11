import {Request} from "express";
import {validationResult} from "express-validator";
import {HttpError, ValidationErrors} from "./types";

export function checkValidationErrors(request: Request) {
    const errors: ValidationErrors = {};
    const result = validationResult(request);
    if (!result.isEmpty()) {
        result.array().forEach(({ msg, type, }) => {
            if (!!errors[type]) {
                errors[type] = [...errors[type], msg];
            } else {
                errors[type] = [msg];
            }
        });
        throw new HttpError({message: "Validation Error", statusCode: 400, validationErrors: errors});
    }
}