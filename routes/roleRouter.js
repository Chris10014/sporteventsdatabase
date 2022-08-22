"use strict"

const express = require("express");
const roleController = require("../controllers/roleController");
const roleRouter = express.Router();
roleRouter.use(express.json());

roleRouter
  .route("/api/v1/roles", roleController.index)
  .get(roleController.getAllRoles)
  .post(roleController.createRole)
  .put(roleController.updateRole)
  .delete(roleController.deleteRoles);

roleRouter
  .route("/api/v1/roles/:roleId")
  .get(roleController.getRoleById)
  .post(roleController.createRoleWithId)
  .put(roleController.updateRoleById)
  .delete(roleController.deleteRoleById);

module.exports = roleRouter;