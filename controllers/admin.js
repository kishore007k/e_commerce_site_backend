import UserModal from "../models/userModal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { toTitleCase, validateEmail } from "../middleware/auth.js";
import { JWT_SECRET } from "../config/keys.js";

export const admin = async (req, res) => {
	let { loggedInUserId } = req.body;
	try {
		let loggedInUserRole = await UserModal.findById(loggedInUserId);
		res.json({ role: loggedInUserRole.userRole }); // Returns the role of the user as 0 or 1
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
							userRole: 1, // Field userName change to userRole from role
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

export const singIn = async (req, res) => {
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
				return res.json({
					token: token,
					user: encode,
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
