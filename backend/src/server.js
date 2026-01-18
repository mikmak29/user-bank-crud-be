import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import asyncHandler from 'express-async-handler';
import cookie from 'cookie-parser';
import compression from 'compression';
import express from 'express';

import globalErrorHandler from "./middleware/globalErrorHandler.js";
import NotFoundHandler from './errors/NotFoundHandler.js';
import userRoute from './routes/user.routes.js';
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

app.use(NotFoundHandler); // -> Handles unexpected writing of path
app.use(globalErrorHandler);

const serverStarter = asyncHandler(async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server is listening at port ${PORT}`);
	});
});

serverStarter();
