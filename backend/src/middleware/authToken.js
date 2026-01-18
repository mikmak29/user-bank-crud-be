import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import errorHandler from "./errorHandler.js";

dotenv.config();

const authToken = asyncHandler(async (req, res, next) => {
    const authHears = req.headers.authorization;
    const token = authHears && authHears.split(" ")[1];

    if (!token) {
        return errorHandler("Unauthorized", 401, "authToken.js");
    }

    return jwt.verify(token, process.env.PRIVATE_ACCESS_TOKEN, (error, decoded) => {
        if (error) {
            return errorHandler("Invalid token", 401, "authToken.js");
        }

        const { work_experience: { frontend, backend, database } } = decoded;

        const userPayload = {
            username: decoded.username,
            email: decoded.email,
            country: decoded.country,
            work_experience: {
                frontend: frontend,
                backend: backend,
                database: database,
            },
            isWFHType: decoded.isWFHType
        };

        req.userData = userPayload;
        next();
    });
});

export default authToken;
