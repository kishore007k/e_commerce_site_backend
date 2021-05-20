import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { toTitleCase, validateEmail } from "../middleware/auth.js";
import UserModal from "../models/userModal.js";
import cryptoRandomString from "crypto-random-string";

import { JWT_SECRET } from "../config/keys.js";
import SendEmail from "../auth/SendEmail.js";
import ForgotPass from "../auth/ForgotPass.js";

export const getAllUsers = async (req, res) => {
	try {
		let Users = await UserModal.find({}).sort({ _id: -1 });
		if (Users) {
			return res.json({ Users });
		}
	} catch (err) {
		console.log(err);
	}
};

export const getSingleUser = async (req, res) => {
	let { id } = req.params;
	if (!id) {
		return res.json({ error: "User Email must be provided" });
	} else {
		try {
			let user = await UserModal.findById(id).select(
				"userName email userImage _id verified userRole secretKey phoneNumber"
			);
			if (user) {
				return res.send({ user });
			}
		} catch (err) {
			console.log(err);
		}
	}
};

export const addUser = async (req, res) => {
	let { userName, email, password, cPassword } = req.body;
	let error = {};
	if (!userName || !email || !password || !cPassword) {
		error = {
			...error,
			userName: "Filed must not be empty",
			email: "Filed must not be empty",
			password: "Filed must not be empty",
			cPassword: "Filed must not be empty",
		};
		return res.json({ error });
	}
	if (userName.length < 3 || userName.length > 25) {
		error = { ...error, userName: "userName must be 3-25 character" };
		return res.json({ error });
	} else {
		if (validateEmail(email)) {
			userName = toTitleCase(userName);
			if (password !== cPassword) {
				res.send({ message: "Password doesn't not match" });
			}
			if ((password.length > 255) | (password.length < 8)) {
				error = {
					...error,
					password: "Password must be 8 character",
					userName: "",
					email: "",
				};
				return res.json({ error });
			} else {
				// If Email & Number exists in Database then:
				try {
					password = bcrypt.hashSync(password, 10);
					const data = await UserModal.findOne({ email: email });
					if (data) {
						error = {
							...error,
							password: "",
							userName: "",
							email: "Email already exists",
						};
						return res.json({ error });
					} else {
						const secretKey = cryptoRandomString(24);
						const newUser = new UserModal({
							userName,
							email,
							password,
							secretKey,
							userRole: 0,
						});
						newUser.save().catch((err) => {
							console.log(err);
						});

						// Email verification
						SendEmail(email, secretKey);
						res.send({ message: "Please verify your Email" });
					}
				} catch (err) {
					console.log(err);
				}
			}
		} else {
			error = {
				...error,
				password: "",
				userName: "",
				email: "Email is not valid",
			};
			return res.json({ error });
		}
	}
};

export const editUser = async (req, res) => {
	const { uId, userName, phoneNumber, userImage } = req.body;

	try {
		await UserModal.findByIdAndUpdate(uId, {
			userName: userName,
			phoneNumber: phoneNumber,
			userImage: userImage,
			updatedAt: Date.now(),
		});

		const user = await UserModal.findById(uId);

		res.status(200).send({ message: "User Updated Successfully", user: user });
	} catch (error) {
		res.status(400).send({ message: error });
	}
};

export const deleteUser = async (req, res) => {
	let { uId, status } = req.body;
	if (!uId || !status) {
		return res.json({ message: "All filled must be required" });
	} else {
		let currentUser = UserModal.findByIdAndDelete(uId, {
			status: status,
			updatedAt: Date.now(),
		});
		currentUser.exec((err, result) => {
			if (err) console.log(err);
			return res.json({ success: "User deleted successfully" });
		});
	}
};

export const loginUser = async (req, res) => {
	let { email, password } = req.body;
	if (!email || !password) {
		return res.json({
			error: "Fields must not be empty",
		});
	}
	try {
		const data = await UserModal.findOne({ email: email });
		if (!data) {
			return res.json({
				error: "Invalid email or password",
			});
		} else {
			const login = await bcrypt.compare(password, data.password);
			if (login) {
				const token = jwt.sign({ _id: data._id, role: data.userRole }, JWT_SECRET);
				const encode = jwt.verify(token, JWT_SECRET);
				return res.send({
					token: token,
					user: encode,
					data,
				});
			} else {
				return res.json({
					error: "Invalid email or password",
				});
			}
		}
	} catch (err) {
		console.log(err);
	}
};

export const accountActivation = async (req, res) => {
	const { secretKey } = req.params;

	const user = await UserModal.findOne({ secretKey: secretKey });

	if (user) {
		user.verified = true;
		await user.save();
		res.redirect("/profile");
	} else {
		res.json({ message: "User not found" });
	}
};

export const forgotPassword = async (req, res) => {
	const { email, secretKey } = req.params;

	const user = await UserModal.findOne({ secretKey: secretKey });

	try {
		if (user) {
			ForgotPass(email, secretKey);
			res.send({ message: "Password Reset Link has been sent to your email." });
		}
	} catch (error) {
		res.send({ message: error });
	}
};

export const resetPasswordRender = async (req, res) => {
	const { email, secretKey } = req.params;

	res.redirect("http://localhost:3000/resetPassword");
};

export const resetPassword = async (req, res) => {
	const { newPassword, cNewPassword, id } = req.body;

	const user = await UserModal.findById(id);

	if (user) {
		if (newPassword !== cNewPassword)
			res.send({ message: "Passwords doesn't match" });
		const password = bcrypt.hashSync(newPassword, 10);

		user.password = password;
		await user.save();
		return res.json({ success: "Password updated successfully" });
	} else {
		res.json({ message: "User not found" });
	}
};
