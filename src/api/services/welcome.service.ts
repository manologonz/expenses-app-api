import {BaseService} from "./base.service";
import {IWelcome, Welcome} from "../entities/welcome.entity";

export class WelcomeService extends BaseService<IWelcome> {

}

export default new WelcomeService(Welcome);