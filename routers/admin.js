import express from "express";
import { admin } from "../controllers/admin.js";
import { allUser, signUp } from "../controllers/admin.js";
import { isAdmin, isAuth, loginCheck } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", admin);
router.post("/signUp", signUp);
router.get("/user", loginCheck, isAuth, isAdmin, allUser);

export default router;
