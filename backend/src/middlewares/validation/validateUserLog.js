import asyncHandler from "express-async-handler";

import * as userLogService from "../../services/userLog.service.js";
import errorHandler from "../../utils/errorHandler.js";
import validateObjectId from "../../utils/validateObjectId.js";
import { FILE_NAME } from "../../constants/FILE_NAME.js";

const {
	middlewares: { VALIDATE_USER_LOG },
} = FILE_NAME;

export const validateUserLogByType = asyncHandler(async (req, res, next) => {
	const type = req.query.type;

	if (!type) {
		return errorHandler("Query not found.", 409, VALIDATE_USER_LOG);
	}

	req.data = type;
	next();
});

export const validateUserLogsById = asyncHandler(async (req, res, next) => {
	const id = req.params?.id;
	const userId = req.userData?.id;

	validateObjectId(id);

	req.data = {
		id,
		userId,
	};
	next();
});

export const validateDeleteUserLogById = asyncHandler(async (req, res, next) => {
	const id = req.params.id;
	const userId = req.userData?.id;

	validateObjectId(id);

	const user = await userLogService.ownerShip(id, userId);

	if (!user) {
		return errorHandler("No data found or you don't have permission.", 409, VALIDATE_USER_LOG);
	}

	const data = {
		id,
		userId,
	};

	req.data = data;
	next();
});
