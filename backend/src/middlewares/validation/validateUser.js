import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import * as userService from "../../services/user.service.js";
import userSchema from "../../schemas/user.schema.js";
import errorHandler from "../../utils/errorHandler.js";
import { FILE_NAME } from "../../constants/FILE_NAME.js";

const {
	middlewares: { VALIDATE_USER },
} = FILE_NAME;

export const validateRegister = asyncHandler(async (req, res, next) => {
	const result = await userSchema.safeParseAsync(req.body);

	if (!result.success) {
		const formattedError = result.error.issues
			.map((issue) => {
				return `${issue.path.join(".")}: ${issue.message}`;
			})
			.join(", ");

		return errorHandler(formattedError, 409, VALIDATE_USER);
	}

	const { password } = result.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const userData = result.data;
	const { email, country } = userData; // Extract all the data, password is excluded

	const data = {
		email,
		hashedPassword,
		country,
	};

	req.data = data;
	next();
});

export const validateLogin = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	const user = await userService.loginUser(email);

	if (!user) {
		return errorHandler("Invalid credentials.", 401, VALIDATE_USER);
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return errorHandler("Invalid credentials.", 401, VALIDATE_USER);
	}

	req.user = user;

	next();
});

export const validateRefreshToken = asyncHandler(async (req, res, next) => {
	const token = req.cookies?.refreshToken;

	if (!token) {
		return errorHandler("Unauthorized", 401, VALIDATE_USER);
	}

	const verifyToken = jwt.verify(token, process.env.PRIVATE_REFRESH_ACCESS_TOKEN);

	req.verifyToken = verifyToken;
	next();
});
