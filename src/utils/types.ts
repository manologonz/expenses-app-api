import { User } from '../../generated/prisma';
import { Request } from 'express';
import { AccountActivation } from '../../generated/prisma/index';
import { validationResult } from 'express-validator';

export class HttpError extends Error {
    statusCode: number;
    message: string;
    validationErrors?: ValidationErrors;

    constructor(params: { message: string; statusCode: number; validationErrors?: ValidationErrors }) {
        super(params.message);
        this.message = params.message;
        this.statusCode = params.statusCode;
        this.validationErrors = params.validationErrors;
    }
}

export type ErrorResponse = {
    detail: string | object | ValidationErrors;
    stack?: string;
};

export type ValidationErrors = {
    [field: string]: string[];
};

export interface CustomJwtPayload extends Omit<User, 'password'> {}

export interface UserLean extends Omit<User, 'password'> {}

export interface AccountActivationLean extends Omit<AccountActivation, 'id'> {}

export type ModelResultOptions = {
    lean?: boolean;
};

type Unit =
    | 'Years'
    | 'Year'
    | 'Yrs'
    | 'Yr'
    | 'Y'
    | 'Weeks'
    | 'Week'
    | 'W'
    | 'Days'
    | 'Day'
    | 'D'
    | 'Hours'
    | 'Hour'
    | 'Hrs'
    | 'Hr'
    | 'H'
    | 'Minutes'
    | 'Minute'
    | 'Mins'
    | 'Min'
    | 'M'
    | 'Seconds'
    | 'Second'
    | 'Secs'
    | 'Sec'
    | 's'
    | 'Milliseconds'
    | 'Millisecond'
    | 'Msecs'
    | 'Msec'
    | 'Ms';

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type JwtExpiration = `${number}` | `${number}${UnitAnyCase}` | `${number} ${UnitAnyCase}`;

export type JwtValidationData = {
    data?: UserLean;
    expired: boolean;
    valid: boolean;
};

export type GenerateTokensOpts = {
    getRefresh: boolean;
};

export type CredentialsResponse = {
    accessToken: string;
    refreshToken?: string;
};

export interface AuthRequest extends Request {
    state: {
        user: UserLean;
    };
}

export interface ValidationResult {
    valid: boolean;
    detail?: string;
}
