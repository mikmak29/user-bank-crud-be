import asyncHandler from 'express-async-handler';

import * as userLogService from '../services/userLog.service.js';
import { FILE_NAME } from "../constants/FILE_NAME.js";
import errorHandler from "../utils/errorHandler.js";
import validateObjectId from '../utils/validateObjectId.js';
import ResponseHandler from "../utils/ResponseHandler.js";

const { controllers: { userlog_controller } } = FILE_NAME;

export const getAllLogs = asyncHandler(async (req, res) => {
    const data = await userLogService.fetchLogs();

    if (!data) {
        return errorHandler("No data found.", 400, userlog_controller);
    }

    ResponseHandler(res, "success", 200, {
        message: "Retrieved User Logs",
        data
    });
});

export const getUserLogByType = asyncHandler(async (req, res) => {
    const type = req.query.type;

    if (!type) {
        return errorHandler("Query not found.", 409, userlog_controller);
    }

    const logsData = await userLogService.fetchLogByType(type);

    if (!logsData) {
        return errorHandler(`No type ${type} data found.`, 409, userlog_controller);
    }

    ResponseHandler(res, "success", 200, {
        message: `Retrieve Users log by ${type}`,
        logsData
    });
});

export const getUserLogsById = asyncHandler(async (req, res) => {
    const id = req.userData?.id;

    console.log(id);
    validateObjectId(id);

    const logsData = await userLogService.fetchLogById(id);

    if (!logsData) {
        return errorHandler("ID not found or invalid", 409, userlog_controller);
    }

    ResponseHandler(res, "success", 200, {
        message: "Retrieved logs",
        logsData
    });
});

export const deleteUserLogById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    validateObjectId(id);

    const deletedLog = await userLogService.deleteLogById(id);

    if (!deletedLog) {
        return errorHandler("ID not found or invalid", 409, userlog_controller);
    }

    ResponseHandler(res, "success", 200, {
        message: "Log deleted successfully",
        data: null
    });
});
