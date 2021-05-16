import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { toTitleCase, validateEmail } from "../middleware/auth.js";
import UserModal from "../models/userModal.js";

import { JWT_SECRET } from "../config/keys.js";

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
	let { uId } = req.body;
	if (!uId) {
		return res.json({ error: "User ID must be provided" });
	} else {
		try {
			let User = await UserModal.findById(uId).select(
				"name email userName phoneNumber userImage updatedAt createdAt"
			);
			if (User) {
				return res.send({ User });
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
		error = { ...error, userName: "userName must be 3-25 charecter" };
		return res.json({ error });
	} else {
		if (validateEmail(email)) {
			userName = toTitleCase(userName);
			if ((password.length > 255) | (password.length < 8)) {
				error = {
					...error,
					password: "Password must be 8 charecter",
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
						let newUser = new UserModal({
							userName,
							email,
							password,
							// ========= Here role 1 for admin signup role 0 for customer signup =========
							userRole: 0, // Field userName change to userRole from role
						});
						newUser
							.save()
							.then((data) => {
								return res.json({
									success: "Account create successfully. Please login",
								});
							})
							.catch((err) => {
								console.log(err);
							});
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
		const user = await UserModal.findById(uId);

		const currentUser = await UserModal.findByIdAndUpdate(uId, {
			userName: userName,
			phoneNumber: phoneNumber,
			userImage: userImage,
			updatedAt: Date.now(),
		});

		res.status(200).send({ ...user._doc, message: "User Updated Successfully" });
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

export const changePassword = async (req, res) => {
	let { uId, oldPassword, newPassword } = req.body;
	if (!uId || !oldPassword || !newPassword) {
		return res.json({ message: "All filled must be required" });
	} else {
		const data = await UserModal.findOne({ _id: uId });
		if (!data) {
			return res.json({
				error: "Invalid user",
			});
		} else {
			const oldPassCheck = await bcrypt.compare(oldPassword, data.password);
			if (oldPassCheck) {
				newPassword = bcrypt.hashSync(newPassword, 10);
				let passChange = UserModal.findByIdAndUpdate(uId, {
					password: newPassword,
				});
				passChange.exec((err, result) => {
					if (err) console.log(err);
					return res.json({ success: "Password updated successfully" });
				});
			} else {
				return res.json({
					error: "Your old password is wrong!!",
				});
			}
		}
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
