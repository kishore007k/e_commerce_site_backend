import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
	userName: { type: String, require: true },
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, require: true },
	password: { type: String, require: true },
	image: { type: String },
	adminPermission: { type: Boolean },
	id: { type: String },
});

const adminModal = mongoose.model("admin", adminSchema);

export default adminModal;
