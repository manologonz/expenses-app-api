export class HttpError extends Error {
    statusCode: number;
    message: string;
    validationErrors?: ValidationErrors;

    constructor(params: {message: string, statusCode: number, validationErrors?: ValidationErrors}) {
        super(params.message);
        this.message = params.message;
        this.statusCode = params.statusCode;
        this.validationErrors = params.validationErrors;
    }
}

export type ErrorResponse = {
    detail: string | object | ValidationErrors,
    stack?: string
}

export type ValidationErrors = {
    [field: string]: string[];
}
