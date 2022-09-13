"use strict"

const express = require("express");
const raceController = require("../controllers/raceController");
const raceRouter = express.Router();
raceRouter.use(express.json());

raceRouter
  .route("/api/v1/races", raceController.index)
  .get(raceController.getAllRaces)
  .post(raceController.createRace)
  .put(raceController.updateRace)
  .delete(raceController.deleteRaces);

raceRouter
  .route("/api/v1/races/:raceId")
  .get(raceController.getRaceById)
  .post(raceController.createRaceWithId)
  .put(raceController.updateRaceById)
  .delete(raceController.deleteRaceById);

module.exports = raceRouter;