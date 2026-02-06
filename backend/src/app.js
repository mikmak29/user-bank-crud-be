import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookie from "cookie-parser";
import compression from "compression";
import express from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import redirectURL from "./middlewares/redirectURL.js";
import userRoute from "./routes/user.route.js";
import transactionRoute from "./routes/transaction.route.js";
import userLogRoute from "./routes/userLog.route.js";
import connectDB from "./config/database.js";
import rateLimiter from "./helpers/rateLimit.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookie());
app.use(express.json());
app.use(compression());

app.use(rateLimiter);
app.use("/api/user", userRoute); // -> route
app.use("/api/transaction", transactionRoute);
app.use("/api/logs", userLogRoute);

app.use(redirectURL); // -> Handles unexpected writing of url
app.use(globalErrorHandler);

export default app;
