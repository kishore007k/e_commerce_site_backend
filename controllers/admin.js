import UserModal from "../models/userModal.js";
import bcrypt from "bcryptjs";
import { toTitleCase, validateEmail } from "../middleware/auth.js";
import SendEmail from "../auth/SendEmail.js";
import cryptoRandomString from "crypto-random-string";

export const admin = async (req, res) => {
	let { id: _id } = req.params;
	try {
		let loggedInUserRole = await UserModal.findById(_id);
		res.json({ role: loggedInUserRole.userRole, data: loggedInUserRole }); // Returns the role of the user as 0 or 1
	} catch {
		res.status(404);
	}
};

export const allUser = async (req, res) => {
	try {
		let allUser = await UserModal.find({});
		res.json({ users: allUser });
	} catch {
		res.status(404);
	}
};

export const signUp = async (req, res) => {
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
							userRole: 1,
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
