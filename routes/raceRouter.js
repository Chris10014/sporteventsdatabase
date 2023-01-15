"use strict"

const express = require("express");
const raceController = require("../controllers/raceController");
const authMiddleware = require("../middlewares/auth");
const { isAllowedToCreateRaces, isAllowedToHandleRacesById } = require("../middlewares/accessControls/racesResource")
const raceRouter = express.Router();
raceRouter.use(express.json());

raceRouter
  .route("/api/v1/races", raceController.index)
  .get(raceController.getAllRaces)
  .post(authMiddleware.isLoggedIn, isAllowedToCreateRaces, raceController.createRace)
  .put(authMiddleware.isLoggedIn,raceController.updateRace) //Not supported
  .delete(authMiddleware.isLoggedIn, raceController.deleteRaces); //Not supported

raceRouter
  .route("/api/v1/races/:raceId")
  .get(raceController.getRaceById)
  .post(authMiddleware.isLoggedIn, raceController.createRaceWithId) //Not supported
  .put(authMiddleware.isLoggedIn, isAllowedToHandleRacesById("update"), raceController.updateRaceById)
  .delete(authMiddleware.isLoggedIn, isAllowedToHandleRacesById("delete"), raceController.deleteRaceById);

module.exports = raceRouter;