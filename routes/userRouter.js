"use strict"

const express = require("express");
const userController = require("../controllers/userController");
const { isLoggedIn, hasRole } = require("../middlewares/auth");
const { isAllowedToHandleUsersById, isAllowedToCreateUsers } = require("../middlewares/accessControls/usersResource");
const userRouter = express.Router();
userRouter.use(express.json());

userRouter
  .route("/api/v1/users", userController.index) //Only for admin
  .get(isLoggedIn, userController.getAllUsers) //Returned list of users will be scoped in userController
  .post(isLoggedIn, isAllowedToCreateUsers, userController.createUser)
  .put(isLoggedIn, userController.updateUser) //Not supported
  .delete(isLoggedIn, userController.deleteUsers); //Not supported yet

userRouter
  .route("/api/v1/users/:userId?")
  .get(isLoggedIn, isAllowedToHandleUsersById("read"), userController.getUserById)
  .post(isLoggedIn, userController.createUserWithId) //Not supported
  .put(isLoggedIn, isAllowedToHandleUsersById("update"), userController.updateUserById)
  .delete(isLoggedIn, isAllowedToHandleUsersById("delete"), userController.deleteUserById); 

module.exports = userRouter;