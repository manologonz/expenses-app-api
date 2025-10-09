import {Request, Response, NextFunction} from "express";
import {checkValidationErrors} from "../../utils/helpers";
import userService from "../services/user.service";
import {IUser} from "../entities/user.entity";
import bcrypt from "bcryptjs";

export async function register(req: Request, res:Response, next: NextFunction) {
    try {
        checkValidationErrors(req);
        const userData: IUser = req.body;

        userData.password = await bcrypt.hash(userData.password, 12);

        const user = await userService.repository.save(userData);

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token: userService.getUserToken(user.email, user.id)
        });
    } catch(error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction){
    try {
        checkValidationErrors(req);

        const userInfo = await userService.validateUser(req.body.email, req.body.password);

        if(userInfo !== null) {
            return res.status(200).json(userInfo);
        }

        return res.status(400).json({detail: "email or password invalid"});

    } catch (error) {
        next(error);
    }
}

