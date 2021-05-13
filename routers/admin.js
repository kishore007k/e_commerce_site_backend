import express from "express";
import { admin } from "../controllers/admin.js";
import { allUser, signUp, singIn } from "../controllers/admin.js";
import { isAdmin, isAuth, loginCheck } from "../middleware/auth.js";

const router = express.Router();

router.post("/isAdmin", admin);
router.post("/signUp", signUp);
router.post("/signIn", singIn);
router.get("/user", loginCheck, isAuth, isAdmin, allUser);

export default router;
