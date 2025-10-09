import express from "express";
import {createWelcomeEntry, welcome} from "../controllers/welcome.controller";
import {createWelcomeValidators} from "../validators/welcome.validator";

const router = express.Router();
const prefix = "/welcome";

router.get(prefix, welcome);
router.put(prefix, createWelcomeValidators, createWelcomeEntry);

export default router;
