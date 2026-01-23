import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';

import * as transactionService from '../services/transaction.service.js';
import * as userLogService from '../services/userLog.service.js';
import { FILE_NAME } from "../constants/FILE_NAME.js";
import errorHandler from "../utils/errorHandler.js";
import transactionSchema from '../schemas/transaction.schema.js';
import ResponseHandler from "../utils/ResponseHandler.js";

dotenv.config();

const { controllers: { transaction_controller } } = FILE_NAME;

export const depositMoney = asyncHandler(async (req, res) => {
    const result = await transactionSchema.safeParseAsync(req.body);
    const userId = req.userData?.id;

    if (!result.success) {
        return errorHandler("All fields are required.", 400, transaction_controller);
    }

    const { type, amount } = result.data;

    const user = await transactionService.userAccount(userId);

    if (!user) {
        return errorHandler("User not found", 404, transaction_controller);
    }

    const currentBalance = user.current_balance || 0;

    const transactionData = await transactionService.depositHandler(userId, {
        userId,
        owner: user.owner,
        type,
        current_balance: currentBalance + amount,
        status: "completed",
        reference_id: uuidv4()
    });

    await userLogService.createLog({
        userId: user.userId,
        email: user.owner,
        type: transactionData.type,
        amount: amount,
        status: transactionData.status,
        reference_id: transactionData.reference_id
    });

    ResponseHandler(res, "success", 201, {
        message: "You deposit money successfully.",
        data: {
            current_balance: currentBalance + amount,
        }
    });
});

export const withdrawMoney = asyncHandler(async (req, res) => {
    const result = await transactionSchema.safeParseAsync(req.body);
    const userId = req.userData?.id;
    let currentBalance = 0;

    if (!result.success) {
        return errorHandler("All fields are required", 400, transaction_controller);
    }

    const { type, amount } = result.data;

    const user = await transactionService.userAccount(userId);

    if (!user) {
        return errorHandler("User not found", 404, transaction_controller);
    }

    const user_balance = user.current_balance || 0;

    if (amount > user_balance) {
        return errorHandler("Insufficient balance.", 409, transaction_controller);
    } else {
        currentBalance = user_balance - amount;
    }

    const transactionData = await transactionService.withdrawalHandler(userId, {
        userId,
        owner: user.owner,
        type,
        current_balance: currentBalance,
        status: "completed",
        reference_id: uuidv4()
    });

    await userLogService.createLog({
        userId: user.userId,
        email: user.owner,
        type: transactionData.type,
        amount: amount,
        status: transactionData.status,
        reference_id: transactionData.reference_id
    });

    ResponseHandler(res, "success", 201, {
        message: "You withdraw money successfully.",
        data: {
            current_balance: currentBalance
        }
    });
});

export const transferMoney = asyncHandler(async (req, res) => {
    const result = await transactionSchema.safeParseAsync(req.body);
    const userId = req.userData?.id;
    let currentBalance = 0;

    if (!result.success) {
        return errorHandler("All fields are required.", 400, transaction_controller);
    }

    const { type, amount, transferTo } = result.data;

    const user = await transactionService.userAccount(userId);
    const receiver = await transactionService.receiverAccount(transferTo);

    if (!user || !receiver) {
        return errorHandler("User not found.", 404, transaction_controller);
    }

    if (user.owner === transferTo) {
        return errorHandler("You cannot transfer by your own account.", 409, transaction_controller);
    }

    const user_balance = user.current_balance || 0;
    const receiver_balance = receiver.current_balance || 0;

    if (amount > user_balance) {
        return errorHandler("Insufficient balance.", 409, transaction_controller);
    } else {
        currentBalance = user_balance - amount;
    }

    const transactionSenderData = await transactionService.transferHandler(userId, {
        userId,
        owner: user.owner,
        type,
        current_balance: currentBalance,
        transferTo: transferTo,
        status: "completed",
        reference_id: uuidv4()
    });

    const transactionReceiverData = await transactionService.transferReceiverHandler(receiver.userId, {
        userId: receiver.userId,
        owner: receiver.owner,
        current_balance: receiver_balance + amount,
        status: "completed",
        reference_id: uuidv4()
    });

    await userLogService.createLog({
        userId: user.userId,
        email: user.owner,
        type: transactionSenderData.type,
        amount: amount,
        transferTo: receiver.owner,
        status: transactionSenderData.status,
        reference_id: transactionSenderData.reference_id
    });

    await userLogService.createLog({
        userId: receiver.userId,
        email: receiver.owner,
        type: transactionReceiverData.type,
        amount: amount,
        transferredFrom: user.owner,
        status: transactionReceiverData.status,
        reference_id: transactionReceiverData.reference_id
    });

    ResponseHandler(res, "success", 201, {
        message: "You transferred money successfully.",
        data: {
            current_balance: currentBalance
        }
    });
});
