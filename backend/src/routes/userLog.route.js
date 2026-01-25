import express from 'express';

import * as userLogController from '../controllers/userlog.controller.js';
import authToken from '../middlewares/authToken.js';

const route = express.Router();

route.get("/", authToken, userLogController.getAllLogs);
route.get("/current", authToken, userLogController.getUserLogByType);
route.get("/user", authToken, userLogController.getUserLogsById);
route.delete("/del/:id", authToken, userLogController.deleteUserLogById);

export default route;
