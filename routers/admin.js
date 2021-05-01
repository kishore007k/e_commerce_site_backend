import express from "express";
import { signUpAdmin, signInAdmin } from "../controllers/admin.js";

const router = express.Router();

router.post("/signUp", signUpAdmin);
router.post("/signIn", signInAdmin);

export default router;
