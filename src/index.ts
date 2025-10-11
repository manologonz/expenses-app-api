import 'reflect-metadata';
import app from './api/app';
import { PORT, HOST } from './utils/constants';
import { databaseCheckHealth } from './db/index';

(async function () {
    try {
        await databaseCheckHealth();
        app.listen(PORT, HOST, () => {
            console.log(`listening on: ${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
})();
