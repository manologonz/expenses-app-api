import {DataSource} from "typeorm";

import {CONNECTION_CONFIGS} from "../utils/constants";

const AppDataSource = new DataSource(CONNECTION_CONFIGS);
export default AppDataSource;
