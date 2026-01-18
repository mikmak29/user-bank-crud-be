import express from "express";

import * as userController from '../controllers/user.controller.js';
import authToken from "../middleware/authToken.js";

const route = express.Router();

route.post("/", userController.createUserData);
route.get("/", authToken, userController.fetchAllUsers);

export default route;
