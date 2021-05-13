import Mongoose from "mongoose";
import ProductModal from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await ProductModal.find()
			.populate("pCategory", "_id cName")
			.sort({ _id: -1 });
		res.status(200).json(products);
	} catch (error) {
		res.status(404).json({ message: error });
	}
};

export const getSingleProduct = async (req, res) => {
	const { id: _id } = req.params;

	try {
		if (!Mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).send("No product with that Id");
		}

		const singleProduct = await (await ProductModal.findById(_id))
			.$getAllSubdocs()
			.$getPopulatedDocs();
		res.status(200).json(singleProduct);
	} catch (error) {
		res.status(400).send({ message: error });
	}
};

export const createProduct = async (req, res) => {
	const { pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus } =
		req.body;

	if (
		!pName |
		!pDescription |
		!pPrice |
		!pQuantity |
		!pCategory |
		!pOffer |
		!pStatus
	) {
		return res.json({ error: "All filled must be required" });
	}

	if (pName.length > 255 || pDescription.length > 3000) {
		return res.json({
			error: "Name 255 & Description must not be 3000 character long",
		});
	}

	try {
		const newProduct = new ProductModal({
			...body,
			createdAt: new Date().toISOString(),
		});

		await newProduct.save();
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(409).json({ message: error });
	}
};

export const updateProduct = async (req, res) => {
	const { id: _id } = req.params;
	const {
		pId,
		pName,
		pDescription,
		pPrice,
		pQuantity,
		pCategory,
		pOffer,
		pStatus,
		pImages,
	} = req.body;

	if (
		!pId |
		!pName |
		!pDescription |
		!pPrice |
		!pQuantity |
		!pCategory |
		!pOffer |
		!pStatus |
		!pImages
	) {
		return res.json({ error: "All filled must be required" });
	}

	if (pName.length > 255 || pDescription.length > 3000) {
		return res.json({
			error: "Name 255 & Description must not be 3000 character long",
		});
	}

	if (!Mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send("No post with that Id");
	}

	const updatedProduct = await ProductModal.findByIdAndUpdate(
		{ ...body },
		{
			new: true,
		}
	);
	res.status(200).send({ message: "Product edited successfully!" });
};

export const deleteProduct = async (req, res) => {
	const { id: _id } = req.params;
	if (!Mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send("No Product with that Id");
	}
	await ProductModal.findByIdAndRemove(_id);
	res.send({ message: "Product has been deleted Successfully" });
};

export const getProductByCategory = async (req, res) => {
	const { id: catId } = req.params;
	if (!catId) {
		return res.json({ error: "All filled must be required" });
	} else {
		try {
			const products = await ProductModal.find({ pCategory: catId }).populate(
				"pCategory",
				"cName"
			);
			if (products) {
				return res.json({ Products: products });
			}
		} catch (err) {
			return res.json({ error: "Search product wrong" });
		}
	}
};

export const getProductByPrice = async (req, res) => {
	const { price } = req.params;
	if (!price) {
		return res.json({ error: "All filled must be required" });
	} else {
		try {
			const products = await ProductModal.find({ pPrice: { $lt: price } })
				.populate("pCategory", "cName")
				.sort({ pPrice: -1 });
			if (products) {
				return res.json({ Products: products });
			}
		} catch (err) {
			return res.json({ error: "Filter product wrong" });
		}
	}
};

export const getWishListProduct = async (req, res) => {
	const { productArray } = req.body;
	if (productArray.length === 0) {
		return res.json({ error: "All filled must be required" });
	} else {
		try {
			const wishProducts = await ProductModal.find({
				_id: { $in: productArray },
			});
			if (wishProducts) {
				return res.json({ Products: wishProducts });
			}
		} catch (err) {
			return res.json({ error: "Filter product wrong" });
		}
	}
};

export const getCartProduct = async (req, res) => {
	const { productArray } = req.body;
	if (productArray.length === 0) {
		return res.json({ error: "All filled must be required" });
	} else {
		try {
			const cartProducts = await ProductModal.find({
				_id: { $in: productArray },
			});
			if (cartProducts) {
				return res.json({ Products: cartProducts });
			}
		} catch (err) {
			return res.json({ error: "Cart product wrong" });
		}
	}
};

export const addReview = async (req, res) => {
	const { pId, uId, rating, review } = req.body;

	if (!pId || !rating || !review || !uId) {
		return res.json({ error: "All filled must be required" });
	} else {
		const checkReviewRatingExists = await ProductModal.findOne({ _id: pId });

		if (checkReviewRatingExists.pRatingsReviews.length > 0) {
			checkReviewRatingExists.pRatingsReviews.map((item) => {
				if (item.user === uId) {
					return res.json({ error: "Your already reviewed the product" });
				} else {
					try {
						const newRatingReview = ProductModal.findByIdAndUpdate(pId, {
							$push: {
								pRatingsReviews: {
									review: review,
									user: uId,
									rating: rating,
								},
							},
						});
						newRatingReview.exec((err, result) => {
							if (err) {
								console.log(err);
							}
							return res.json({ success: "Thanks for your review" });
						});
					} catch (err) {
						return res.json({ error: "Cart product wrong" });
					}
				}
			});
		} else {
			try {
				const newRatingReview = ProductModal.findByIdAndUpdate(pId, {
					$push: {
						pRatingsReviews: { review: review, user: uId, rating: rating },
					},
				});
				newRatingReview.exec((err, result) => {
					if (err) {
						console.log(err);
					}
					return res.json({ success: "Thanks for your review" });
				});
			} catch (err) {
				return res.json({ error: "Cart product wrong" });
			}
		}
	}
};

export const deleteReview = async (req, res) => {
	const { rId, pId } = req.body;
	if (!rId) {
		return res.json({ message: "All filled must be required" });
	} else {
		try {
			const reviewDelete = ProductModal.findByIdAndUpdate(pId, {
				$pull: { pRatingsReviews: { _id: rId } },
			});
			reviewDelete.exec((err, result) => {
				if (err) {
					console.log(err);
				}
				return res.json({ success: "Your review is deleted" });
			});
		} catch (err) {
			console.log(err);
		}
	}
};
