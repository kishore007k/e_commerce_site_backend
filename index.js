import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import products from "./routers/products.js";
import users from "./routers/users.js";
import admin from "./routers/admin.js";
import orders from "./routers/orders.js";
import categories from "./routers/categories.js";
import dashboard from "./routers/dashboard.js";
import { adminAuth, auth } from "./middleware/auth.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const URL = process.env.URL;
const PORT = process.env.PORT || 3001;

app.use("/admin", admin);
app.use("/api/users", users);
app.use("/api/products", adminAuth, products);
app.use("/api/orders", adminAuth, orders);
app.use("/api/categories", adminAuth, categories);
app.use("/dashboard", adminAuth, dashboard);

app.get("/", auth, (req, res) => {
	res.send("Hello from API");
});

mongoose
	.connect(URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
		useCreateIndex: true,
	})
	.then(() => {
		app.listen(PORT, () => {
			console.log(`MongoDb database connected successfully 
Server running on http://localhost:${PORT}`);
		});
	})
	.catch((e) => {
		console.log(e.message);
	});

mongoose.set("useFindAndModify", false);
