import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

dotenv.config();

export const accessTokenHandler = asyncHandler(async (userPayload) => {
    return jwt.sign(userPayload, process.env.PRIVATE_ACCESS_TOKEN, { expiresIn: "15m" });
});

export const refreshTokenHandler = asyncHandler(async (userPayload) => {
    return jwt.sign(userPayload, process.env.PRIVATE_REFRESH_ACCESS_TOKEN, { expiresIn: "7d" });
});
