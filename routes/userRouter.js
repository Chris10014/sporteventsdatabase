"use strict"

const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");
const userRouter = express.Router();
userRouter.use(express.json());

userRouter
  .route("/api/v1/users", userController.index)
  .get(authMiddleware.isLoggedIn, userController.getAllUsers)
  .post(userController.createUser)
  .put(authMiddleware.isLoggedIn, userController.updateUser)
  .delete(authMiddleware.isLoggedIn, userController.deleteUsers);

userRouter
  .route("/api/v1/users/:userId")
  .get(authMiddleware.isLoggedIn, userController.getUserById)
  .post(authMiddleware.isLoggedIn, userController.createUserWithId)
  .put(authMiddleware.isLoggedIn, userController.updateUserById)
  .delete(authMiddleware.isLoggedIn, userController.deleteUserById);

module.exports = userRouter;