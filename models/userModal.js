import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	name: { type: String, require: true },
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, require: true },
	password: { type: String, require: true },
	image: { type: String },
	id: { type: String },
});

export default mongoose.model("users", userSchema);
