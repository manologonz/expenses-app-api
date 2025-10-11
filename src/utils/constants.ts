import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const PORT = process.env.PORT || 8080;

export const APP_DOMAIN = process.env.APP_DOMAIN || 'localhost';

export const apiPath = path.join(__dirname, '..', 'api');
