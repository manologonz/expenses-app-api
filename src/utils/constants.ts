import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
export const HOST = process.env.HOST || 'localhost';
export const ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
};
export const ENABLE_SECURE_COOKIE = NODE_ENV === ENVIRONMENTS.PRODUCTION;

// Auth
export const PASSWORD_LENGTH = 8;
export const INIT_PASSWORD = process.env.INIT_PASSWORD || null;
export const INIT_EMAIL = process.env.INIT_EMAIL || null;
export const KEY_PAIR_ROTATION_COUNT = process.env.KEY_PAIR_ROTATION_COUNT
    ? parseInt(process.env.KEY_PAIR_ROTATION_COUNT)
    : 3;
export const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION
    ? process.env.ACCESS_TOKEN_EXPIRATION
    : '15M';
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION
    ? process.env.REFRESH_TOKEN_EXPIRATION
    : '7D';
export const HASH_SALT = process.env.HASH_SALT ? parseInt(process.env.HASH_SALT) : 10;
export const SECURE_COOKIE = NODE_ENV === ENVIRONMENTS.PRODUCTION;
export const JWT_ALGORITHM = process.env.JWT_ALGORITHM ? process.env.JWT_ALGORITHM : '';
