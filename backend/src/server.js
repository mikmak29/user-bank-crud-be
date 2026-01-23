import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import asyncHandler from 'express-async-handler';
import cookie from 'cookie-parser';
import compression from 'compression';
import express from 'express';

import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import errorURLHandler from './errors/errorURLHandler.js';
import userRoute from './routes/user.route.js';
import transactionRoute from './routes/transaction.route.js';
import userLogRoute from './routes/userLog.route.js';
import connectDB from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8100;

app.use(helmet());
app.use(cors());
app.use(cookie());
app.use(express.json());
app.use(compression());

app.use("/api/user", userRoute); // -> route
app.use("/api/transaction", transactionRoute);
app.use("/api/logs", userLogRoute);

app.use(errorURLHandler); // -> Handles unexpected writing of path
app.use(globalErrorHandler);

const serverStarter = asyncHandler(async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server is listening at port ${PORT}`);
	});
});

serverStarter();
