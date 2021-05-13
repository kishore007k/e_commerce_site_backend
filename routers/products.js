import express from "express";
import {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getSingleProduct,
	getProductByCategory,
	getProductByPrice,
	getWishListProduct,
	getCartProduct,
	addReview,
	deleteReview,
} from "../controllers/products.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.get("/category/:id", getProductByCategory);
router.get("/product/:price", getProductByPrice);

router.post("/wishlist", getWishListProduct);
router.post("/cart", getCartProduct);

router.post("/review", addReview);
router.post("/deleteReview", deleteReview);

export default router;
