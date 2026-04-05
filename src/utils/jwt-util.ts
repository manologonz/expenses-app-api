import { ACCESS_TOKEN_EXPIRATION, HASH_SALT, JWT_ALGORITHM, REFRESH_TOKEN_EXPIRATION } from './constants';
import bcrypt from 'bcryptjs';
import keygen from './keygen';
import {
    CustomJwtPayload,
    GenerateTokensOpts,
    JwtExpiration,
    JwtValidationData,
    UserTokenPayload,
} from '../utils/types';
import jwt, { SignOptions, TokenExpiredError, Algorithm } from 'jsonwebtoken';
import dayjs, { ManipulateType } from 'dayjs';
import { Request } from 'express';
import UserMapper from '../api/mappers/user.mapper';

export class JwtUtil {
    private accessTokenExpiration: JwtExpiration;
    private refreshTokenExpiration: JwtExpiration;
    private hashSalt: number;
    private userMapper: UserMapper;

    constructor() {
        this.accessTokenExpiration = JwtUtil.getExpirationValue(ACCESS_TOKEN_EXPIRATION);
        this.refreshTokenExpiration = JwtUtil.getExpirationValue(REFRESH_TOKEN_EXPIRATION);
        this.hashSalt = HASH_SALT;
        this.userMapper = new UserMapper();

        this.initKeygen();
    }

    initKeygen() {
        keygen.init();
    }

    hashPassword(password: string) {
        return bcrypt.hash(password, this.hashSalt);
    }

    checkPassword(password: string, comparePassword: string) {
        return bcrypt.compare(password, comparePassword);
    }

    generateTokens(userPayload: CustomJwtPayload, opts?: GenerateTokensOpts) {
        const accessTokenKeys = keygen.getSigningKey();
        const refreshTokenKeys = keygen.getSigningKey();

        const jwtOptions: SignOptions = {
            keyid: accessTokenKeys.keyId,
            algorithm: JWT_ALGORITHM as Algorithm,
            expiresIn: this.accessTokenExpiration,
        };

        const accessToken = jwt.sign(userPayload, accessTokenKeys.key, jwtOptions);

        let refreshToken = undefined;
        let refreshExpiration = undefined;

        if (opts?.getRefresh) {
            jwtOptions.keyid = refreshTokenKeys.keyId;
            jwtOptions.expiresIn = this.refreshTokenExpiration;

            refreshToken = jwt.sign(userPayload, refreshTokenKeys.key, jwtOptions);
            refreshExpiration = this.getRefreshTokenExpirationDate();
        }

        return {
            user: userPayload,
            accessToken,
            accessTokenExpiration: this.getAccessTokenExpirationDate(),
            refreshToken,
            refreshExpiration,
        };
    }

    getAccessTokenExpirationDate() {
        const unitRegex = new RegExp(
            '(Years?|Yrs?|Y|Weeks?|W|Days?|D|Hours?|Hrs?|Hr|H|Minutes?|Mins?|Min|M|Seconds?|Secs?|Sec|s|Milliseconds?|Msecs?|Msec|Ms)',
        );

        const match = this.accessTokenExpiration.match(unitRegex);

        const amount = (match?.length ? match[0] : 'D').toLocaleLowerCase() as ManipulateType;

        const value = this.accessTokenExpiration.split(unitRegex)[0];

        return dayjs().add(parseInt(value), amount).toDate();
    }
    getRefreshTokenExpirationDate() {
        const unitRegex = new RegExp(
            '(Years?|Yrs?|Y|Weeks?|W|Days?|D|Hours?|Hrs?|Hr|H|Minutes?|Mins?|Min|M|Seconds?|Secs?|Sec|s|Milliseconds?|Msecs?|Msec|Ms)',
        );

        const match = this.refreshTokenExpiration.match(unitRegex);

        const amount = (match?.length ? match[0] : 'D').toLocaleLowerCase() as ManipulateType;

        const value = this.refreshTokenExpiration.split(unitRegex)[0];

        return dayjs().add(parseInt(value), amount).toDate();
    }

    validateToken(token: string): JwtValidationData {
        const tokenData = jwt.decode(token, { complete: true });

        const validationData: JwtValidationData = {
            valid: true,
            expired: false,
        };

        if (!tokenData?.header?.kid) {
            validationData.valid = false;
            return validationData;
        }

        const keyId = tokenData.header?.kid;
        const key = keygen.getKey('public', keyId);

        if (!key) {
            validationData.valid = false;
            return validationData;
        }

        try {
            const tokenPayload = jwt.verify(token, key) as UserTokenPayload;
            validationData.data = this.userMapper.toLeanModel(tokenPayload);
        } catch (error) {
            validationData.valid = false;
            if (error instanceof TokenExpiredError) {
                validationData.expired = true;
            }
        }

        return validationData;
    }

    getRequestToken(request: Request) {
        const authorizationHeaders = request.headers.authorization;

        const token = authorizationHeaders?.split(' ')[1];

        return token || undefined;
    }

    getRefreshToken(req: Request) {
        return (req.cookies['refresh-token'] as string) || undefined;
    }

    static getExpirationValue(value: string): JwtExpiration {
        const unitRegex = new RegExp(
            '(Years?|Yrs?|Y|Weeks?|W|Days?|D|Hours?|Hrs?|Hr|H|Minutes?|Mins?|Min|M|Seconds?|Secs?|Sec|s|Milliseconds?|Msecs?|Msec|Ms)',
            'i',
        );

        const simpleNumber = /^\d+$/;
        const numberWithUnit = new RegExp(`^\\d+\\s*${unitRegex.source}$`, 'i');

        if (simpleNumber.test(value) || numberWithUnit.test(value)) {
            return value as JwtExpiration;
        } else {
            throw new Error('No valid expiration for token set');
        }
    }
}

const jwtUtil = new JwtUtil();

export default jwtUtil;
