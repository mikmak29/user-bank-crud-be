import jwt from "jsonwebtoken";

import errorHandler from "../utils/errorHandler.js";
import { FILE_NAME } from "../constants/FILE_NAME.js";

const {
	middlewares: { AUTH_TOKEN },
} = FILE_NAME;

const authToken = (req, res, next) => {
	try {
		const authHeaders = req.headers.authorization;
		const token = authHeaders && authHeaders.split(" ")[1];

		if (!token) {
			return errorHandler("Unauthorized", 401, AUTH_TOKEN);
		}

		const decoded = jwt.verify(token, process.env.PRIVATE_ACCESS_TOKEN);

		const userPayload = {
			id: decoded.id,
			email: decoded.email,
			country: decoded.country,
		};

		console.log(decoded);
		req.userData = userPayload;
		next();
	} catch (error) {
		next(error);
	}
};

export default authToken;
