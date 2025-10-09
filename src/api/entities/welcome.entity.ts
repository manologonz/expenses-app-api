import {Column, Entity, EntitySchema, PrimaryGeneratedColumn} from "typeorm";

export interface IWelcome {
    id: number;
    message: string;
}

export const Welcome = new EntitySchema<IWelcome>({
    name: "welcome",
    columns: {
        id: {
            generated: true,
            type: Number,
            primary: true
        },
        message: {
            type: String,
        }
    }
});