"use strict"

const express = require("express");
const teamController = require("../controllers/teamController");
const teamRouter = express.Router();
const { isLoggedIn, hasRole, isTeamCaptain }= require("../middlewares/auth");
teamRouter.use(express.json());

teamRouter
  .route("/api/v1/teams", teamController.index)
  .get(teamController.getAllTeams)
  .post(isLoggedIn, teamController.createTeam)
  .put(isLoggedIn, teamController.updateTeam) //Not supported
  .delete(isLoggedIn, hasRole("admin"), teamController.deleteTeams);//Not supported

teamRouter
  .route("/api/v1/teams/:teamId")
  .get(teamController.getTeamById)
  .post(isLoggedIn, teamController.createTeamWithId) //Not supported
  .put(isLoggedIn, teamController.updateTeamById)
  .delete(isLoggedIn,hasRole("admin"), teamController.deleteTeamById);

teamRouter
  .route("/api/v1/addMember/:teamId/:userId")
  .get(isLoggedIn, isTeamCaptain, teamController.addMemberToTeam);

teamRouter
  .route("/api/v1/removeMember/:teamId/:userId")
  .get(isLoggedIn, isTeamCaptain, teamController.removeMemberFromTeam);

teamRouter
.route("/api/v1/askForAdmission/:teamId/:userId")
.get(isLoggedIn, teamController.askForTeamAdmission);

teamRouter
.route("/api/v1/confirmAdmission/:teamId/:userId")
.get(teamController.confirmTeamAdmission);

teamRouter
.route("/api/v1/rejectAdmission/:teamId/:userId")
.get(teamController.rejectTeamAdmission);

module.exports = teamRouter;