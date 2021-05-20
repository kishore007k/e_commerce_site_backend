import express from "express";
import {
	addUser,
	getAllUsers,
	getSingleUser,
	editUser,
	deleteUser,
	loginUser,
	accountActivation,
	resetPassword,
	resetPasswordRender,
	forgotPassword,
} from "../controllers/users.js";
import { auth, userCheck } from "../middleware/auth.js";

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.get("/singleUser/:id", getSingleUser);
router.post("/signUp", addUser);
router.post("/signIn", loginUser);
router.post("/edit", auth, editUser);
router.delete("/delete", auth, deleteUser);
router.get("/verify/:secretKey", accountActivation);
router.post("/forgotPass/:email/:secretKey", forgotPassword);
router.get("/resetPass/:email/:secretKey", userCheck, resetPasswordRender);
router.post("/resetPass/:email/:secretKey", resetPassword);

export default router;
