import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import errorHandler from "../utils/errorHandler.js";
import { FILE_NAME } from "../constants/FILE_NAME.js";

dotenv.config();

const {
	middlewares: { VALIDATE_REFRESHTOKEN },
} = FILE_NAME;

const validatRefreshToken = asyncHandler(async (req, res, next) => {
	const token = req.cookies?.refreshToken;

	if (!token) {
		return errorHandler("Unauthorized", 401, VALIDATE_REFRESHTOKEN);
	}

	const verifyToken = jwt.verify(token, process.env.PRIVATE_REFRESH_ACCESS_TOKEN);

	req.verifyToken = verifyToken;
	next();
});

export default validatRefreshToken;
