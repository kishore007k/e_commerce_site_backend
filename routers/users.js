import express from "express";
import { getAllUsers, signIn, signUp } from "../controllers/users.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/signUp", signUp);
router.post("/signIn", signIn);

export default router;
