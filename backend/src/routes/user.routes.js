import express from "express";

import * as userController from '../controllers/user.controller.js';
import authToken from "../middleware/authToken.js";

const route = express.Router();

route.post("/register", userController.registerUserData);
route.post("/login", userController.loginUser);
route.post("/refreshToken", userController.refreshToken);
route.get("/userData", authToken, userController.currentUserData);

export default route;
