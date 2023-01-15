"use strict"

const express = require("express");
const roleController = require("../controllers/roleController");
const roleRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
const { isAllowedToHandleRolesById, isAllowedToCreateRoles } = require("../middlewares/accessControls/rolesResource");
roleRouter.use(express.json());

roleRouter
  .route("/api/v1/roles", roleController.index)
  .get(authMiddleware.isLoggedIn, roleController.getAllRoles)
  .post(authMiddleware.isLoggedIn, isAllowedToCreateRoles, roleController.createRole)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), roleController.updateRole) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), roleController.deleteRoles);//Not supported

roleRouter
  .route("/api/v1/roles/:roleId")
  .get(authMiddleware.isLoggedIn, isAllowedToHandleRolesById("read"), roleController.getRoleById)
  .post(authMiddleware.isLoggedIn, isAllowedToCreateRoles, roleController.createRoleWithId) //Not supported
  .put(authMiddleware.isLoggedIn, isAllowedToHandleRolesById("update"), roleController.updateRoleById)
  .delete(authMiddleware.isLoggedIn, isAllowedToHandleRolesById("delete"), roleController.deleteRoleById);

module.exports = roleRouter;