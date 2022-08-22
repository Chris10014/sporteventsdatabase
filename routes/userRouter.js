"use strict"

const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
userRouter.use(express.json());

userRouter
  .route("/api/v1/users", userController.index)
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .put(userController.updateUser)
  .delete(userController.deleteUsers);

userRouter
  .route("/api/v1/users/:userId")
  .get(userController.getUserById)
  .post(userController.createUserWithId)
  .put(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = userRouter;