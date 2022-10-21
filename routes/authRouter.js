"use strict"

const express = require("express");
const { registerUser, loginUser, logoutUser, deleteUserAccount, activateAccount, resendActivationLink } = require("../controllers/authController");
const { validateRegistrationData } = require("../middlewares/dataInputValidation.js");
const { isLoggedIn } = require("../middlewares/auth");
const authRouter = express.Router();
authRouter.use(express.json());

authRouter
  .post("/api/v1/register", validateRegistrationData, registerUser)
  .post("/api/v1/login", loginUser)
  .get("/api/v1/logout", isLoggedIn, logoutUser)
  .get("/api/v1/deleteAccount/:userId?", isLoggedIn, deleteUserAccount)
  .get("/api/v1/activate/:userId/:activationToken", activateAccount)
  .get("/api/v1/activationLink/:email?", resendActivationLink)

module.exports = authRouter;