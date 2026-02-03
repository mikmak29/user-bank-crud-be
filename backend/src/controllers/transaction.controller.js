import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";

import * as transactionService from "../services/transaction.service.js";
import * as userLogService from "../services/userLog.service.js";
import ResponseHandler from "../utils/ResponseHandler.js";

dotenv.config();

export const depositMoney = asyncHandler(async (req, res) => {
	const {
		data: { userId, user, type, amount, currentBalance, newBalance },
	} = req;

	const transactionData = await transactionService.depositHandler(userId, {
		userId,
		owner: user.owner,
		type,
		current_balance: newBalance,
		status: "completed",
		reference_id: uuidv4(),
	});

	await userLogService.createLog({
		userId: user.userId,
		email: user.owner,
		type: transactionData.type,
		amount: amount,
		status: transactionData.status,
		reference_id: transactionData.reference_id,
	});

	ResponseHandler(res, "success", 201, {
		message: "You deposit money successfully.",
		data: {
			depositMoney: `₱${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			currentBalance: `₱${currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
		},
	});
});

export const withdrawMoney = asyncHandler(async (req, res) => {
	const {
		data: { userId, user, type, amount, currentBalance },
	} = req;

	const transactionData = await transactionService.withdrawalHandler(userId, {
		userId,
		owner: user.owner,
		type,
		current_balance: currentBalance,
		status: "completed",
		reference_id: uuidv4(),
	});

	await userLogService.createLog({
		userId: user.userId,
		email: user.owner,
		type: transactionData.type,
		amount: amount,
		status: transactionData.status,
		reference_id: transactionData.reference_id,
	});

	ResponseHandler(res, "success", 201, {
		message: "You withdraw money successfully.",
		data: {
			withdrewMoney: `₱${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			currentBalance: `₱${currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
		},
	});
});

export const transferMoney = asyncHandler(async (req, res) => {
	const {
		data: { userId, user, receiver, type, amount, transferTo, currentBalance, receiverCurrentBalance, currencyCalculatedData },
	} = req;

	const transactionSenderData = await transactionService.transferHandler(userId, {
		userId,
		owner: user.owner,
		type,
		current_balance: currentBalance,
		transferTo: transferTo,
		status: "completed",
		reference_id: uuidv4(),
	});

	const transactionReceiverData = await transactionService.transferReceiverHandler(receiver.userId, {
		userId: receiver.userId,
		owner: receiver.owner,
		type,
		current_balance: receiverCurrentBalance + amount,
		status: "completed",
		reference_id: uuidv4(),
	});

	await userLogService.createLog({
		userId: user.userId,
		email: user.owner,
		type: transactionSenderData.type,
		amount: amount,
		transferTo: receiver.owner,
		status: transactionSenderData.status,
		reference_id: transactionSenderData.reference_id,
	});

	await userLogService.createLog({
		userId: receiver.userId,
		email: receiver.owner,
		type: transactionReceiverData.type,
		amount: amount,
		transferredFrom: user.owner,
		status: transactionReceiverData.status,
		reference_id: transactionReceiverData.reference_id,
	});

	ResponseHandler(res, "success", 201, {
		message: "You transferred money successfully.",
		data: {
			currencyType: currencyCalculatedData.currency,
			calculatedBalance: currencyCalculatedData.calculatedBalance,
			currentBalance: `₱${currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
		},
	});
});
