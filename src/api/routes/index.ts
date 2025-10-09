import {Router} from "express";
import RWelcome from "./welcome.routes";
import RAuth from "./auth.routes";

const router = Router();

router.use(RWelcome);
router.use(RAuth);

export default router;