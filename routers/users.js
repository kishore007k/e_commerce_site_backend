import express from "express";
import {
	addUser,
	getAllUsers,
	getSingleUser,
	editUser,
	deleteUser,
	changePassword,
	loginUser,
	accountActivation,
} from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.get("/singleUser/:id", getSingleUser);
router.post("/signUp", addUser);
router.post("/signIn", loginUser);
router.post("/edit", auth, editUser);
router.delete("/delete", auth, deleteUser);
router.post("/cPassword", auth, changePassword);
router.get("/verify/:secretKey", accountActivation);

export default router;
