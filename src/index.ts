import 'reflect-metadata';
import app from './api/app';
import { PORT } from './utils/constants';
import { checkHealth } from './db/index';

checkHealth()
    .then(() => {
        app.listen(PORT, () => {
            console.log('listening on: http://localhost:' + PORT);
        });
    })
    .catch((error: any) => console.log(error));
