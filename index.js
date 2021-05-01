import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import products from "./routers/products.js";
import users from "./routers/users.js";
import admin from "./routers/admin.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const URL = process.env.URL;
const PORT = process.env.PORT || 3001;

app.use("/api/products", products);
app.use("/api/users", users);
app.use("/admin", admin);

app.get("/", (req, res) => {
	res.send("Hello from API");
});

mongoose
	.connect(URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
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
