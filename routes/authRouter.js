"use strict"

const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/dataInputValidation.js");
const authRouter = express.Router();
authRouter.use(express.json());

authRouter
  .post("/api/v1/register", userMiddleware.validateRegistrationData,  userController.createUser)
  .post("/api/v1/login", authController.loginUser)
  .get("/api/v1/logout", authController.logoutUser)

module.exports = authRouter;