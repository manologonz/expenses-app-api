import {EntitySchema} from "typeorm";

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    username: string;
    active: boolean;
}

export const User = new EntitySchema<IUser>({
    name: "user",
    columns: {
        id: {
            generated: true,
            type: Number,
            primary: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        username: {
            type: String,
            unique: true
        },
        active: {
            type: Boolean,
            default: true
        }
    }
});