import express from "express";
import cookie from 'cookie-parser';
import asyncHandler from "express-async-handler";
import throwHTTPError from "./utils/throwHTTPError.js";
import ResponseHandler from "./utils/ResponseHandler.js";
// import errorHandler from "./middleware/errorHandler.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

const app = express();
const port = 8000 || 8100;

app.use(express.json());
app.use(cookie());

app.get("/api/user", asyncHandler(async (req, res) => {
	const user = undefined;

	if (!user) {
		return new throwHTTPError("All fields are required.", 404);
	}

	res.status(200).json({ user });
}));

app.post("/api/user", asyncHandler(async (req, res) => {
	const { name } = req.body;

	res.cookie("username", name, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		path: '/po'
	});

	const userData = {
		name: name,
		age: 20,
		role: "Duelist"
	};

	ResponseHandler(res, true, 201, userData);
}));

app.use(globalErrorHandler);

app.listen(port, () => {
	console.log(`Server is running at PORT ${port}`);
});
