import mongoose from "mongoose";

const orderModal = mongoose.Schema({
	userId: { type: String, require: true },
	userName: { type: String, require: true },
	productImages: [
		{ itemName: String, itemImage: String, unitPrice: String, counts: String },
	],
	totalCost: String,
	status: [
		{
			orderPlaced: Boolean,
			inProgress: Boolean,
			outForDelivery: Boolean,
			delivered: Boolean,
		},
	],
});

export default mongoose.model("orders", orderModal);
