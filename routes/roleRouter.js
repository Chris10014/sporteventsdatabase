"use strict"

const express = require("express");
const roleController = require("../controllers/roleController");
const roleRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
roleRouter.use(express.json());

roleRouter
  .route("/api/v1/roles", roleController.index)
  .get(roleController.getAllRoles)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin"]), roleController.createRole)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin"]), roleController.updateRole) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin"]), roleController.deleteRoles);//Not supported

roleRouter
  .route("/api/v1/roles/:roleId")
  .get(roleController.getRoleById)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin"]), roleController.createRoleWithId) //Not supported
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin"]), roleController.updateRoleById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin"]), roleController.deleteRoleById);

module.exports = roleRouter;