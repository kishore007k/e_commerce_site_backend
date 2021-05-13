import Mongoose from "mongoose";
import OrderModal from "../models/ordersModel.js";

export const getAllOrders = async (req, res) => {
	try {
		const orders = await OrderModal.find();
		res.status(200).json(orders);
	} catch (error) {
		res.status(404).json({ message: error });
	}
};

export const getUserOrders = async (req, res) => {
	const { id: _id } = req.params;

	try {
		const userOrders = await OrderModal.findById(_id);
		res.status(200).json(userOrders);
	} catch (error) {
		res.status(404).json({ message: error });
	}
};

export const createUserOrders = async (req, res) => {
	const body = req.body;
	const newOrder = new OrderModal({
		...body,
		createdAt: new Date().toISOString(),
	});

	try {
		await newOrder.save();
		res.status(201).json(newOrder);
	} catch (error) {
		res.status(401).json({ message: error });
	}
};

export const updateUserOrderStatus = async (req, res) => {
	const { id: _id } = req.params;
	const body = req.body;

	if (!Mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send("No Order with that Id");
	}

	const updateStatus = await OrderModal.findByIdAndUpdate(
		_id,
		{ ...body, _id },
		{
			new: true,
		}
	);

	res.json(updateStatus);
};

export const deleteUserOrder = async (req, res) => {
	const { id } = req.params;

	if (!Mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send("No order with that Id");
	}
	await OrderModal.findByIdAndRemove(id);
	res.send({ message: "Order has been deleted Successfully" });
};
