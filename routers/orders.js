import express from "express";
import {
	createUserOrders,
	deleteUserOrder,
	getAllOrders,
	getUserOrders,
	updateUserOrderStatus,
} from "../controllers/orders.js";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getUserOrders);
router.post("/", createUserOrders);
router.post("/:id", updateUserOrderStatus);
router.delete("/:id", deleteUserOrder);

export default router;
