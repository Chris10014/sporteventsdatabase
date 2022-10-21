"use strict"

const express = require("express");
const teamController = require("../controllers/teamController");
const teamRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
teamRouter.use(express.json());

teamRouter
  .route("/api/v1/teams", teamController.index)
  .get(teamController.getAllTeams)
  .post(authMiddleware.isLoggedIn, teamController.createTeam)
  .put(authMiddleware.isLoggedIn, teamController.updateTeam) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), teamController.deleteTeams);//Not supported

teamRouter
  .route("/api/v1/teams/:teamId")
  .get(teamController.getTeamById)
  .post(authMiddleware.isLoggedIn, teamController.createTeamWithId) //Not supported
  .put(authMiddleware.isLoggedIn, teamController.updateTeamById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), teamController.deleteTeamById);

teamRouter
  .route("/api/v1/addMember/:teamId/:userId")
  .get(authMiddleware.isLoggedIn, teamController.addMemberToTeam);

teamRouter
  .route("/api/v1/removeMember/:teamId/:userId")
  .get(authMiddleware.isLoggedIn, teamController.removeMemberFromTeam);

module.exports = teamRouter;