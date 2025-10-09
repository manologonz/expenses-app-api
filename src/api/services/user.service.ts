import {BaseService} from "./base.service";
import {User, IUser} from "../entities/user.entity";
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "../../utils/constants";
import bcrypt from "bcryptjs";

class UserService extends BaseService<IUser> {
    getUserToken(email: string, id: number) {
        const secret = JWT_SECRET + email;
        return jwt.sign({id}, secret);
    }

     getUserByEmail(email: string) {
        return this.repository.findOneBy({email});
    }

    getUserByUsername(value: string) {
        return this.repository.findOneBy({username: value});
    }

    async validateUser(email: string, password: string) {
        const user = await this.getUserByEmail(email);
        if(user !== null) {
            const isLoginValid = bcrypt.compare(password, user.password);

            if(!isLoginValid) {
                return null;
            }

            return {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                token: this.getUserToken(user.email, user.id)
            }

        }

        return null;
    }
}

export default new UserService(User);