import mongoose from "mongoose";

const categoriesSchema = mongoose.Schema(
	{
		cName: {
			type: String,
			required: true,
		},
		cImage: {
			type: String,
			default: "category.png",
		},
	},
	{ timestamps: true }
);

const categoriesModal = mongoose.model("categories", categoriesSchema);

export default categoriesModal;
