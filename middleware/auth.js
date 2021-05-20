import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import UserModal from "../models/userModal.js";
import { JWT_SECRET } from "../config/keys.js";

dotenv.config();

export const adminAuth = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = JWT.verify(token, JWT_SECRET);
		res.userDate = decoded;
		if (res.userDate.role === 1) return next();
		return res.status(401).send({ message: "You are not an Admin" });
	} catch (error) {
		return res
			.status(401)
			.json({ status: false, message: "Your session is not valid", data: error });
	}
};

export const auth = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = JWT.verify(token, JWT_SECRET);
		res.userDate = decoded;
		next();
	} catch (error) {
		return res
			.status(401)
			.json({ status: false, message: "Your session is not valid", data: error });
	}
};

export const validateEmail = (mail) => {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
		return true;
	} else {
		return false;
	}
};

export const toTitleCase = (str) => {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

export const emailCheckInDatabase = async (email) => {
	let user = await UserModal.findOne({ email: email });
	user.exec((err, data) => {
		if (!data) {
			return false;
		} else {
			return true;
		}
	});
};

export const phoneNumberCheckInDatabase = async (phoneNumber) => {
	let user = await UserModal.findOne({ phoneNumber: phoneNumber });
	user.exec((err, data) => {
		if (data) {
			return true;
		} else {
			return false;
		}
	});
};

// Admin Check
export const isAdmin = async (req, res, next) => {
	try {
		let reqUser = await UserModal.findById(req.body.loggedInUserId);
		// If user role 0 that's mean not admin it's customer
		if (reqUser.userRole === 0) {
			res.status(403).json({ error: "Access denied" });
		}
		next();
	} catch {
		res.status(404);
	}
};

export const isAuth = async (req, res, next) => {
	let { loggedInUserId } = req.body;
	if (
		!loggedInUserId ||
		!req.userDetails._id ||
		loggedInUserId != req.userDetails._id
	) {
		res.status(403).json({ error: "You are not authenticate" });
	}
	next();
};

export const loginCheck = async (req, res, next) => {
	try {
		let token = req.headers.token;
		token = token.replace("Bearer ", "");
		decode = JWT.verify(token, JWT_SECRET);
		req.userDetails = decode;
		next();
	} catch (err) {
		res.json({
			error: "You must be logged in",
		});
	}
};

export const userCheck = async (req, res, next) => {
	const { email, secretKey } = req.params;

	const user = await UserModal.findOne({ secretKey: secretKey });
	try {
		if (user) next();
	} catch (error) {
		res.send({ message: error });
	}
};
