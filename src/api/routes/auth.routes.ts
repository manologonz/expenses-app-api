import express from "express";
import {register, login} from "../controllers/auth.controller";
import {loginValidator, registerValidator} from "../validators/auth.validator";

const router = express.Router();
const prefix = "/auth";

router.post(`${prefix}/register`, registerValidator, register);
router.post(`${prefix}/login`, loginValidator, login);

export default router;
