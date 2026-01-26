import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import * as userService from "../services/user.service.js";
import errorHandler from "../utils/errorHandler.js";
import { FILE_NAME } from "../constants/FILE_NAME.js";

const {
	middlewares: { VALIDATE_LOGIN },
} = FILE_NAME;

const validateLogin = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	const user = await userService.loginUser(email);

	if (!user) {
		return errorHandler("Invalid credentials.", 401, VALIDATE_LOGIN);
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return errorHandler("Invalid credentials.", 401, VALIDATE_LOGIN);
	}

	req.user = user;

	next();
});

export default validateLogin;
