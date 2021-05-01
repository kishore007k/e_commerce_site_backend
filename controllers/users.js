import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/userModal.js";

export const getAllUsers = async (req, res) => {
	try {
		const users = await UserModal.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ message: error });
	}
};

export const signUp = async (req, res) => {
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
		const existingUser = await UserModal.findOne({ email });

		if (existingUser)
			return res.status(400).send({ message: "User already exists!" });

		if (password !== confirmPassword)
			return res.status(400).json({ message: "Password doesn't match" });

		const hashedPassword = await bcrypt.hash(password, 12);

		const result = await UserModal.create({
			email,
			password: hashedPassword,
			userName,
			firstName,
			lastName,
			image,
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

export const signIn = async (req, res) => {
	const { email, password } = req.body;

	try {
		const existingUser = await UserModal.findOne({ email });

		if (!existingUser) return res.status(404).send({ message: "User not found" });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isPasswordCorrect)
			return res.status(400).send({ message: "Invalid Credentials" });

		const token = jwt.sign(
			{ email: existingUser.email, id: existingUser._id },
			"secret_key",
			{ expiresIn: "1h" }
		);

		res.status(200).json({ result: existingUser, token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};
