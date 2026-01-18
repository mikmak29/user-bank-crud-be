import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import errorHandler from "../middleware/errorHandler.js";
import ResponseHandler from '../utils/ResponseHandler.js';
import userSchema from "../schemas/user.schema.js";
import User from '../models/UserModel.js';

dotenv.config();

export const createUserData = asyncHandler(async (req, res) => {
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
    const { email, country } = userData; // Extract all the all the object data

    res.cookie("storedUserData", userData, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/user"
    });

    await User.create({
        email,
        password: hashedPassword,
        country
    });

    ResponseHandler(res, "success", 201, {
        message: "Registered successfully",
        data: null,
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return errorHandler("Invalid credentials.", 401, "user.controller.js");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return errorHandler("Invalid credentials.", 401, "user.controller.js");
    }

    const userPayload = {
        email: user.email,
        country: user.country
    };

    const accessToken = jwt.sign(userPayload, process.env.PRIVATE_ACCESS_TOKEN, { expiresIn: "2m" });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/user"
    });

    await User.updateOne({ _id: user._id }, { lastLogin: new Date() });

    ResponseHandler(res, "success", 200, {
        message: "Login successfully.",
        data: null
    });
});

export const currentUserData = asyncHandler(async (req, res) => {
    const userData = req.userData;

    console.log(userData);
    if (!userData) {
        return errorHandler("No data found.", 404);
    }

    ResponseHandler(res, "success", 200, { data: userData });
});
