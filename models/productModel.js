import mongoose from "mongoose";

const productSchema = mongoose.Schema({
	name: String,
	desc: String,
	count: String,
	images: [String],
	reviews: [
		{
			name: String,
			image: String,
			email: String,
			review: String,
			createdAt: {
				type: Date,
				default: new Date(),
			},
		},
	],
	price: String,
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

const ProductModal = mongoose.model("products", productSchema);

export default ProductModal;
