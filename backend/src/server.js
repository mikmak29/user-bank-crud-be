import dotenv from "dotenv";
import asyncHandler from "express-async-handler";

import connectDB from "./config/database.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8100;

const serverStarter = asyncHandler(async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server is listening at port ${PORT}`);
	});
});

serverStarter();
