import { Response, NextFunction } from 'express';
import { AuthRequest, HttpError } from '../../../utils/types';
import userService from '../../services/user.service';

export async function userRegistration(req: AuthRequest, res: Response, next: NextFunction) {
    const data = req.body;

    const newUser = await userService.createUser(data, { lean: true });

    res.status(200).json({ detail: '', data: newUser });
}

export async function activateUser() {}
export async function removeUser(req: AuthRequest, res: Response, next: NextFunction) {
    const username = req.params.username;
    const requestError = new HttpError({ message: "Couln't delete user", statusCode: 400 });

    if (!username) {
        throw requestError;
    }

    const userRepo = new UserRepo({ username });

    await userRepo.init();

    const deletedUser = await userRepo.deleteUser();

    if (!deletedUser) {
        res.status(400).json({ detail: 'User not found.' });
        return;
    }

    res.status(200).json({ detail: 'User deleted' });
}

export async function inviteUser(req: AuthRequest, res: Response, next: NextFunction) {
    const data = req.body;

    const invite = await userService.generateUserInvite(data.email, data.role);

    res.status(200).json({ detail: 'Invite created', inviteToken: invite.activationToken });
}
