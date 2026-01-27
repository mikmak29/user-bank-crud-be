import express from "express";

import * as userController from "../controllers/user.controller.js";
import { validateRegister, validateLogin, validateRefreshToken } from "../middlewares/validation/validateUser.js";
import authToken from "../middlewares/authToken.js";

const route = express.Router();

route.post("/register", validateRegister, userController.registerUserData);
route.post("/login", validateLogin, userController.loginUser);
route.post("/refreshToken", validateRefreshToken, userController.refreshToken);
route.get("/userData", authToken, userController.currentUserData);
route.put("/update/:id", authToken, userController.updateUserData);

export default route;
