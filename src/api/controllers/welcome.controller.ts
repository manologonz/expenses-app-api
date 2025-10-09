import {Request, Response, NextFunction} from "express";
import {APP_DOMAIN} from "../../utils/constants";
import {checkValidationErrors} from "../../utils/helpers";
import welcomeService from "../services/welcome.service";
import {Welcome} from "../entities/welcome.entity";
import db from "../../db";

export async function welcome(req: Request, res: Response, next: NextFunction) {
    try {
        const config = await welcomeService.repository.findOneBy({});

        type ResBody = {
            message: string,
            endpoint?: {
                method: string,
                url: string
            }
        }

        const body: ResBody = {
            message: "",
        }

        if(config === null)  {
            body.message = "This is a default message, to change it you can use the create welcome message endpoint";
            body.endpoint = {
                method: "PUT",
                url: `http://${APP_DOMAIN}:5000/api/welcome`
            };
        } else {
           body.message = config.message;
        }

        res.json(body);
    } catch (error) {
        next(error);
    }
}

export async function createWelcomeEntry(req: Request, res: Response, next: NextFunction) {
    try {
        checkValidationErrors(req);

        let config = await welcomeService.repository.findOneBy({});
        if(config === null) {
            config = await welcomeService.repository.save({message: req.body.message});
        } else {
            config.message = req.body.message;
            config = await welcomeService.repository.save(config);
        }

        return res.json({currentMessage: config.message});
    } catch (error) {
        next(error);
    }
}
