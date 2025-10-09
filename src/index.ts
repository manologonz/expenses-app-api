import "reflect-metadata";
import app from "./api/app";
import db from "./db";
import {PORT} from "./utils/constants";

db.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log("listening on: http://localhost:"+PORT);
        });
    })
    .catch((error) => console.log(error));
