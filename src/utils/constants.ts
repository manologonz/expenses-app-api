import dotenv from "dotenv";
import {DataSourceOptions} from "typeorm";
import path from "path";

dotenv.config();

export const PORT = process.env.PORT || 8080;

export const DB_PORT = Number(process.env.DB_PORT) || 5432;

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USERNAME = process.env.DB_USERNAME || "postgres";

export const DB_PASSWORD = process.env.DB_PASSWORD || "";

export const DB_DATABASE = process.env.DB_DATABASE || "api_starter";

export const APP_DOMAIN = process.env.APP_DOMAIN || "localhost";

export const JWT_SECRET = process.env.JWT_SECRET || "mysupersecret";

const apiPath = path.join(__dirname, "..", "api");

export const CONNECTION_CONFIGS: DataSourceOptions = {
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    logging: true,
    synchronize: true,
    entities: [
        `${apiPath}/entities/**/*.entity.ts`
    ],
};