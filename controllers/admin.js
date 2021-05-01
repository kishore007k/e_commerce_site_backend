import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AdminModel from "../models/adminModel.js";

export const signUpAdmin = async (req, res) => {
	const {
		email,
		userName,
		firstName,
		lastName,
		password,
		confirmPassword,
		image,
	} = req.body;

	try {
		const existingUser = await AdminModel.findOne({ email });

		if (existingUser)
			return res.status(400).send({ message: "User already exists!" });

		if (password !== confirmPassword)
			return res.status(400).json({ message: "Password doesn't match" });

		const hashedPassword = await bcrypt.hash(password, 12);

		const result = await AdminModel.create({
			email,
			password: hashedPassword,
			userName,
			firstName,
			lastName,
			image,
			adminPermission: true,
		});

		const token = jwt.sign(
			{ email: result.email, id: result._id },
			"secret_key",
			{ expiresIn: "1h" }
		);

		res.status(201).json({ result, token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const signInAdmin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const existingAdmin = await AdminModel.findOne({ email });

		if (!existingAdmin)
			return res.status(404).send({ message: "Admin not found" });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingAdmin.password
		);

		if (!isPasswordCorrect)
			return res.status(400).send({ message: "Invalid Credentials" });

		const token = jwt.sign(
			{ email: existingAdmin.email, id: existingAdmin._id },
			"secret_key",
			{ expiresIn: "1h" }
		);

		res.status(200).json({ result: existingAdmin, token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};
