import {checkSchema} from "express-validator";

export const createWelcomeValidators = checkSchema({
    message: {
        isString: {
            errorMessage: "This field must be string"
        },
        exists: {
            errorMessage: "This is a required field"
        }
    }
});