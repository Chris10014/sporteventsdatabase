"use strict"

const express = require("express");
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/auth");
const userRouter = express.Router();
userRouter.use(express.json());

userRouter
  .route("/api/v1/users", userController.index)
  .get(userMiddleware.isLoggedIn, userController.getAllUsers)
  .post(userController.createUser)
  .put(userMiddleware.isLoggedIn, userController.updateUser)
  .delete(userMiddleware.isLoggedIn, userController.deleteUsers);

userRouter
  .route("/api/v1/users/:userId")
  .get(userMiddleware.isLoggedIn, userController.getUserById)
  .post(userMiddleware.isLoggedIn, userController.createUserWithId)
  .put(userMiddleware.isLoggedIn, userController.updateUserById)
  .delete(userMiddleware.isLoggedIn, userController.deleteUserById);

module.exports = userRouter;