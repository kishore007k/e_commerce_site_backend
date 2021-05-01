import Mongoose from "mongoose";
import ProductModal from "../models/productModal.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await ProductModal.find();
		res.status(200).json(products);
	} catch (error) {
		res.status(404).json({ message: error });
	}
};

export const createProduct = async (req, res) => {
	const body = req.body;
	const newProduct = new ProductModal({
		...body,
		createdAt: new Date().toISOString(),
	});

	try {
		await newProduct.save();
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(409).json({ message: error });
	}
};

export const updateProduct = async (req, res) => {
	const { id: _id } = req.params;
	const body = req.body;

	if (!Mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send("No post with that Id");
	}
	const updatedProduct = await ProductModal.findByIdAndUpdate(
		_id,
		{ ...body, _id },
		{
			new: true,
		}
	);
	res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;
	if (!Mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send("No post with that Id");
	}
	await ProductModal.findByIdAndRemove(id);
	res.send({ message: "Post has been deleted Successfully" });
};
