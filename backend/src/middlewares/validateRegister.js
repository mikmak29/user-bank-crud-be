import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import userSchema from "../schemas/user.schema.js";
import errorHandler from "../utils/errorHandler.js";
import { FILE_NAME } from "../constants/FILE_NAME.js";

const {
	middlewares: { VALIDATE_REGISTER },
} = FILE_NAME;

const validateRegister = asyncHandler(async (req, res, next) => {
	const result = await userSchema.safeParseAsync(req.body);

	if (!result.success) {
		const formattedError = result.error.issues
			.map((issue) => {
				return `${issue.path.join(".")}: ${issue.message}`;
			})
			.join(", ");

		return errorHandler(formattedError, 409, VALIDATE_REGISTER);
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

export default validateRegister;
