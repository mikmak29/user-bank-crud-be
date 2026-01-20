import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';

import * as transactionService from '../services/transaction.service.js';
import errorHandler from "../utils/errorHandler.js";
import ResponseHandler from "../utils/ResponseHandler.js";

dotenv.config();

export const depositMoney = asyncHandler(async (req, res) => {
    const { type, amount } = req.body;
    const userEmail = req.userData?.email;

    if (!type || !amount) {
        return errorHandler("All fields are required.", 409, "transaction.controller");
    }

    const user = await transactionService.currentBalance(userEmail);

    if (user) {
        await transactionService.depositHandler({
            owner: req.userData?.email,
            type,
            current_balance: user.current_balance + amount,
            status: "completed",
            reference_id: uuidv4()
        });

        await transactionService.deletePreviousData(userEmail);
    } else {
        await transactionService.depositHandler({
            owner: req.userData?.email,
            type,
            current_balance: amount,
            status: "completed",
            reference_id: uuidv4()
        });
    }


    ResponseHandler(res, "success", 201, {
        message: "You deposit money successfully.",
        data: {
            current_balance: amount,
        }
    });
});

export const withdrawMoney = asyncHandler(async (req, res) => {
    const { type, amount } = req.body;
    const userEmail = req.userData?.email;
    let amountWithdraw = 0;

    if (!type || !amount) {
        return errorHandler("All fields are required.", 409, "transaction.controller");
    }

    const user = await transactionService.currentBalance(userEmail);

    if (amount > user.current_balance) {
        return errorHandler("Insufficient balance.", 409, "transaction.controller");
    } else {
        amountWithdraw = user.current_balance - amount;
    }

    await transactionService.withdrawalHandler({
        owner: userEmail,
        type,
        current_balance: amountWithdraw,
        status: "completed",
        reference_id: uuidv4()
    });

    await transactionService.deletePreviousData(userEmail);

    ResponseHandler(res, "success", 201, {
        message: "You withdraw money successfully.",
        data: {
            current_balance: null
        }
    });
});
