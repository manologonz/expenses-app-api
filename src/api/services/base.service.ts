import {Repository, EntityTarget, Entity, ObjectLiteral} from "typeorm";
import db from "../../db";

export class BaseService<Entity extends ObjectLiteral> {
    repository: Repository<Entity>;

    constructor(target: EntityTarget<Entity>) {
        this.repository = db.getRepository(target);
    }
}