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
    const { username, email, country, work_experience: { frontend, backend, database }, isWFHType } = userData; // Extract all the all the object data

    const accessToken = jwt.sign(userData, process.env.PRIVATE_ACCESS_TOKEN, { expiresIn: "2m" });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/user"
    });

    res.cookie("storedUserData", userData, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/user"
    });

    await User.create({
        username,
        email,
        password: hashedPassword,
        country,
        work_experience: {
            frontend,
            backend,
            database
        },
        isWFHType
    });
    ResponseHandler(res, "success", 201, { data: userData });
});

export const fetchAllUsers = asyncHandler(async (req, res) => {
    const userData = req.userData;

    if (!userData) {
        return errorHandler("No data found.", 404);
    }

    ResponseHandler(res, "success", 201, { data: userData });

});

export const updateUserDataById = asyncHandler(async (req, res) => {
    const userData = req.cookies?.userData;

    res.json(userData);
});
