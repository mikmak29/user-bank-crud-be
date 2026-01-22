import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import * as userService from '../services/user.service.js';
import * as transactionService from '../services/transaction.service.js';
import errorHandler from "../utils/errorHandler.js";
import ResponseHandler from '../utils/ResponseHandler.js';
import { accessTokenHandler, refreshTokenHandler } from '../utils/accessToken.js';
import userSchema from "../schemas/user.schema.js";
import validateObjectId from "../utils/validateObjectId.js";

dotenv.config();

export const registerUserData = asyncHandler(async (req, res) => {
    const result = await userSchema.safeParseAsync(req.body);

    if (!result.success) {
        const formattedError = result.error.issues.map(issue => {
            return `${issue.path.join('.')}: ${issue.message}`;
        }).join(', ');

        return errorHandler(formattedError, 409, "user.controller.js");
    }

    const { password } = result.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = result.data;
    const { email, country } = userData; // Extract all the data, password is excluded

    const validateEmail = await userService.isEmailExist(email);

    if (validateEmail) {
        return errorHandler("This Email already exists.", 409, "user.controller.js");
    }

    res.cookie("storedUserData", userData, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/user"
    });

    const newUser = await userService.registerUser({
        email,
        password: hashedPassword,
        country,
        isActive: true
    });

    await transactionService.createData({
        userId: newUser._id,
        owner: email,
        type: "pending",
        current_balance: 0,
        status: "pending",
        reference_id: uuidv4()
    });

    ResponseHandler(res, "success", 201, {
        message: "Registered successfully",
        data: null,
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userService.loginUser(email);

    if (!user) {
        return errorHandler("Invalid credentials.", 401, "user.controller.js");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return errorHandler("Invalid credentials.", 401, "user.controller.js");
    }

    const userPayload = {
        id: user._id,
        email: user.email,
        country: user.country
    };

    const accessToken = await accessTokenHandler(userPayload);

    const refreshToken = await refreshTokenHandler(userPayload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/user"
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/user/refreshToken"
    });

    await userService.lastLoginUser(user._id);

    const tokens = {
        accessToken,
        refreshToken
    };

    ResponseHandler(res, "success", 200, {
        message: "Login successfully.",
        data: tokens
    });
});

export const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        return errorHandler("Unauthorized", 401, "user.controller.js");
    }

    try {
        const verifyToken = jwt.verify(token, process.env.PRIVATE_REFRESH_ACCESS_TOKEN);

        const user = verifyToken;

        const userPayload = {
            id: user.id,
            email: user.email,
            country: user.country
        };

        const accessToken = await accessTokenHandler(userPayload);

        const refreshToken = await refreshTokenHandler(userPayload);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/api/user"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/api/user/refreshToken"
        });

        ResponseHandler(res, "success", 200, {
            message: "Refresh token successfully.",
            data: null
        });

    } catch (error) {
        return errorHandler(error.message, 401, "user.controller.js");
    }
});

export const updateUserData = asyncHandler(async (req, res) => {
    const { id } = req.params;

    validateObjectId(id);

    const user = await userService.isIdExist(id);

    if (!user) {
        return errorHandler("ID not found.", 404, "user.controller.js");
    }

    // Verify ownership: ensure the logged-in user can only update their own data
    if (req.userData?.id !== id) {
        return errorHandler("Unauthorized: You can only update your own data.", 403, "user.controller.js");
    }

    await userService.updateUser(id, req.body, true);

    ResponseHandler(res, "success", 201, {
        message: "Data updated successfully.",
        data: null
    });
});

export const currentUserData = asyncHandler(async (req, res) => {
    const userId = req.userData?.id;

    if (!userId) {
        return errorHandler("ID not found", 404, "user.controller.js");
    }

    const user = await transactionService.inquiryBalanceHandler(userId);

    if (!user) {
        return errorHandler("No data found.", 404);
    }

    const userData = {
        id: user._id,
        owner: user.owner,
        type: user.type,
        current_balance: user.current_balance,
        status: user.status,
        reference_id: user.reference_id
    };

    ResponseHandler(res, "success", 200, {
        message: "Retrieve data successfully.",
        data: userData
    });
});
