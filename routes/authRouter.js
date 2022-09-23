"use strict"

const express = require("express");
const authController = require("../controllers/authController");
const userMiddleware = require("../middlewares/dataInputValidation.js");
const authRouter = express.Router();
authRouter.use(express.json());

authRouter
  .post("/api/v1/register", userMiddleware.validateRegistrationData, authController.registerUser)
  .post("/api/v1/login", authController.loginUser)
  .get("/api/v1/logout", authController.logoutUser)
  .get("/api/v1/activate/:userId/:activationToken", authController.activateAccount)
  .get("/api/v1/activationLink/:email", authController.resendActivationLink)

module.exports = authRouter;