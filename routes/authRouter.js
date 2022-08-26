"use strict"

const express = require("express");
const authController = require("../controllers/authController");
const authRouter = express.Router();
authRouter.use(express.json());

authRouter
  .post("/api/v1/auth/register", authController.registerUser)
  .post("/api/v1/auth/login", authController.loginUser)
  .get("/api/v1/auth/logout", authController.logoutUser)

module.exports = authRouter;