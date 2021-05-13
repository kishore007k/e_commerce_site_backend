import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			maxlength: 32,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
		},
		password: {
			type: String,
			require: true,
		},
		cPassword: {
			type: String,
		},
		userRole: {
			type: Number,
			required: true,
		},
		phoneNumber: {
			type: Number,
		},
		userImage: {
			type: String,
			default: "user.png",
		},
		verified: {
			type: String,
			default: false,
		},
		secretKey: {
			type: String,
			default: null,
		},
		history: {
			type: Array,
			default: [],
		},
	},
	{ timestamp: true }
);

const userModal = mongoose.model("users", userSchema);

export default userModal;
