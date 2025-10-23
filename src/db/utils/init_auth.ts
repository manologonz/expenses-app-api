import userService from '../../api/services/user.service';
import { INIT_EMAIL, INIT_PASSWORD } from '../../utils/constants';
import { $Enums } from '../../../generated/prisma';

async function initUsers() {
    if (!!INIT_EMAIL && !!INIT_PASSWORD) {
        const adminCount = await userService.getAdminCount();

        if (adminCount > 0) {
            return;
        }

        await userService.createUser({
            firstName: 'Admin',
            lastName: 'User',
            username: 'admin',
            email: INIT_EMAIL,
            password: INIT_PASSWORD,
            role: $Enums.Role.ADMINISTRATOR,
        });
    } else {
        console.log('No Email or Password configured.');
    }
}

initUsers()
    .then(() => console.log('GENERATING USER'))
    .catch((error) => console.log('error', error));
