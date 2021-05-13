import express from "express";
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	getSingleCategory,
	updateCategory,
} from "../controllers/categories.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getSingleCategory);
router.post("/", createCategory);
router.post("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
