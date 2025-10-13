import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../../utils/types';
import userService from '../../services/user.service';
import accountActivationService from '../../services/account-activation.service';

export async function userRegistration(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const registrationToken = req.query.registrationToken as string;
    const requestError = new HttpError({ message: 'Unable to process registration', statusCode: 400 });

    const accountActivationData = await accountActivationService.validateAccountActivationToken(
        registrationToken,
        data.email,
    );

    console.log(accountActivationData);

    if (!accountActivationData) {
        requestError.message = 'Invalid account activation token';
        throw requestError;
    }

    const newUser = await userService.createUser(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: data.password,
            email: accountActivationData.email,
            role: accountActivationData.role,
        },
        { lean: true },
    );

    res.status(200).json({ detail: '', data: newUser });
}

export async function updateUserActiveStatus(req: Request, res: Response, next: NextFunction) {
    const idToUpdate = parseInt(req.params.id);

    const requestError = new HttpError({ message: "Couln't activate user", statusCode: 400 });

    if (!idToUpdate) {
        throw requestError;
    }

    const user = await userService.getUserById(idToUpdate);

    if (!user) {
        requestError.statusCode = 404;
        throw requestError;
    }

    const updatedUser = await userService.updateUserActiveStatus(idToUpdate, req.body.status);

    if (!updatedUser.active) {
        requestError.message = "User status can't be udpated";
        requestError.statusCode = 500;
        throw requestError;
    }

    res.status(200).json({ detail: 'User Activated' });
}

export async function removeUser(req: Request, res: Response, next: NextFunction) {
    const idToDelete = parseInt(req.params.id);
    const requestError = new HttpError({ message: "Couln't delete user", statusCode: 400 });

    if (!idToDelete) {
        throw requestError;
    }

    const deletedUser = await userService.deleteUser(idToDelete, { lean: true });

    if (!deletedUser) {
        res.status(400).json({ detail: 'User not found.' });
        return;
    }

    res.status(200).json({ detail: 'User deleted', data: deletedUser });
}

export async function inviteUser(req: Request, res: Response, next: NextFunction) {
    const data = req.body;

    const invite = await userService.generateUserInvite(data.email, data.role);

    res.status(200).json({ detail: 'Invite created', inviteToken: invite.activationToken });
}

// TODO: CREATE OWN USER ACTION ENDPOINTS
