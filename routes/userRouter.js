"use strict"

const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");
const userRouter = express.Router();
userRouter.use(express.json());

userRouter
  .route("/api/v1/users", userController.index) //Only for admin
  .get(authMiddleware.isLoggedIn, authMiddleware.hasRole("writer"), userController.getAllUsers) 
  .post(userController.createUser)
  .put(authMiddleware.isLoggedIn, userController.updateUser)
  .delete(authMiddleware.isLoggedIn, userController.deleteUsers);

userRouter
  .route("/api/v1/users/:userId?")
  .get(authMiddleware.isLoggedIn, userController.getUserById) //Only for admin
  .post(authMiddleware.isLoggedIn, userController.createUserWithId) //Only for admin
  .put(authMiddleware.isLoggedIn, userController.updateUserById)
  .delete(authMiddleware.isLoggedIn, userController.deleteUserById); //Only for admin

userRouter
  .route("/api/v1/users/addRole/:userId/:roleName?")
  .get(authMiddleware.isLoggedIn, userController.addRoleToUser);

userRouter
  .route("/api/v1/users/removeRole/:userId/:roleName?")
  .get(authMiddleware.isLoggedIn, userController.removeRoleFromUser);

userRouter
  .route("/api/v1/users/addTeam/:userId?/:teamName?")
  .get(authMiddleware.isLoggedIn, userController.addTeamToUser);

userRouter
  .route("/api/v1/users/removeTeam/:userId/:teamName?")
  .get(authMiddleware.isLoggedIn, userController.removeTeamFromUser);

module.exports = userRouter;