import type { Request, Response, NextFunction } from 'express';
import userService from '../../services/user.service';
import jwtUtil from '../../../utils/jwt-util';
import { HttpError } from '../../../utils/types';
export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const result = await userService.checkCredentials(email, password);

    if (!result.valid || !result.user) {
        res.status(400).json({
            message: 'Username or password incorrect',
        });

        return;
    }

    const tokens = await userService.generateUserAccess(result.user, {
        getRefresh: true,
    });

    res.json(tokens);
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
    const reqRefreshToken = jwtUtil.getRefreshToken(req);
    const requestError = new HttpError({ message: 'Invalid token', statusCode: 400 });

    if (!reqRefreshToken) {
        next(requestError);
        return;
    }

    const tokenValidation = jwtUtil.validateToken(reqRefreshToken);

    if (!tokenValidation.valid) {
        if (tokenValidation.expired) {
            requestError.message = 'Token expired';
        }

        next(requestError);
        return;
    }

    if (!tokenValidation.data?.id) {
        requestError.message = 'Token data invalid';
        next(requestError);
        return;
    }

    const { accessToken } = await userService.generateUserAccess(tokenValidation.data);

    res.status(200).json({
        access_token: accessToken,
    });
}
