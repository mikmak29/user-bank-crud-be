import express from 'express';

import * as transactionController from '../controllers/transaction.controller.js';
import authToken from "../middleware/authToken.js";


const route = express.Router();

route.patch("/deposit", authToken, transactionController.depositMoney);
route.patch("/withdraw", authToken, transactionController.withdrawMoney);
route.post("/transfer", authToken, transactionController.transferMoney);

export default route;
