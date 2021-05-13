import mongoose from "mongoose";

const categoriesSchema = mongoose.Schema(
	{
		cName: {
			type: String,
			required: true,
		},
		cDescription: {
			type: String,
			required: true,
		},
		cImage: {
			type: String,
			default: "category.png",
		},
		cStatus: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const categoriesModal = mongoose.model("categories", categoriesSchema);

export default categoriesModal;
