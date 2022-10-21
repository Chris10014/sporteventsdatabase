"use strict"

const express = require("express");
const userController = require("../controllers/userController");
const { isLoggedIn, hasRole } = require("../middlewares/auth");
const { isAllowedToGetUser } = require("../middlewares/userPermissions");
const userRouter = express.Router();
userRouter.use(express.json());

userRouter
  .route("/api/v1/users", userController.index) //Only for admin
  .get(isLoggedIn, hasRole("admin"), userController.getAllUsers)
  .post(isLoggedIn, hasRole("admin"), userController.createUser)
  .put(isLoggedIn, userController.updateUser)
  .delete(isLoggedIn, hasRole("admin"), userController.deleteUsers);

userRouter
  .route("/api/v1/users/:userId?")
  .get(isLoggedIn, isAllowedToGetUser, userController.getUserById) //Only for admin
  .post(isLoggedIn, userController.createUserWithId) //Only for admin
  .put(isLoggedIn, userController.updateUserById)
  .delete(isLoggedIn, userController.deleteUserById); //Only for admin

module.exports = userRouter;