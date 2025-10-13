import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, HttpError, UserLean } from './types';
import jwtUtil from './jwt-util';
import { $Enums } from '../../generated/prisma';

// Not Found error generator
export function notFound(req: Request, res: Response, next: NextFunction) {
    const error: HttpError = new HttpError({ message: 'Not Found', statusCode: 404 });
    next(error);
}

// Error response handler
export function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
    res.status(err.statusCode || 500);
    const data: ErrorResponse = {
        detail: err.message,
    };

    if (err.validationErrors) {
        data.detail = err.validationErrors;
    }

    if (process.env.NODE_ENV === 'development') {
        data.stack = err.stack;
    }

    res.json(data);
}

export async function authenticated(req: Request, res: Response, next: NextFunction) {
    const authToken = jwtUtil.getRequestToken(req);
    const authError = new HttpError({ message: 'Not authenticated', statusCode: 403 });

    if (!authToken) {
        next(authError);
        return;
    }

    const tokenValidation = jwtUtil.validateToken(authToken);

    if (!tokenValidation.valid) {
        if (tokenValidation.expired) {
            authError.message = 'Token expired';
        }
        next(authError);
        return;
    }

    if (!req.state) {
        req.state = {};
    }

    req.state.user = tokenValidation.data as UserLean;
    next();
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    const userState = req?.state?.user;

    if (!(userState?.role === $Enums.Role.ADMINISTRATOR)) {
        throw new HttpError({ message: 'Not authorized', statusCode: 403 });
    }

    next();
}
