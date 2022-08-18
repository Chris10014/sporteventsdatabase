"use strict"

const express = require("express");
const teamController = require("../controllers/teamController");
const teamRouter = express.Router();
teamRouter.use(express.json());

teamRouter
  .route("/api/v1/teams", teamController.index)
  .get(teamController.getAllTeams)
  .post(teamController.createTeam)
  .put(teamController.updateTeam)
  .delete(teamController.deleteTeams);

teamRouter
  .route("/api/v1/teams/:teamId")
  .get(teamController.getTeamById)
  .post(teamController.createTeamWithId)
  .put(teamController.updateTeamById)
  .delete(teamController.deleteTeamById);

module.exports = teamRouter;