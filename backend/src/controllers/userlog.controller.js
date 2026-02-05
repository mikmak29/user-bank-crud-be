import asyncHandler from "express-async-handler";

import * as userLogService from "../services/userLog.service.js";
import ResponseHandler from "../utils/ResponseHandler.js";

export const getAllUserLogsADMIN = asyncHandler(async (req, res) => {
	const data = await userLogService.fetchLogs();

	ResponseHandler(res, "success", 200, {
		message: "Retrieved User Logs",
		data: data || null,
	});
});

export const getUserLogByTypeADMIN = asyncHandler(async (req, res) => {
	const { data: type } = req;

	const logsData = await userLogService.fetchLogByType(type);

	ResponseHandler(res, "success", 200, {
		message: `Retrieve Users log by ${type}`,
		logsData,
	});
});

export const getUserLogsById = asyncHandler(async (req, res) => {
	const {
		data: { id, userId },
	} = req;

	const logsData = await userLogService.fetchLogById(id, userId);

	ResponseHandler(res, "success", 200, {
		message: "Retrieved logs",
		logsData,
	});
});

export const deleteUserLogById = asyncHandler(async (req, res) => {
	const {
		data: { id, userId },
	} = req;

	await userLogService.deleteLogById(id, userId);

	ResponseHandler(res, "success", 200, {
		message: "Log deleted successfully",
		data: null,
	});
});
