"use strict"

const express = require("express");
const raceController = require("../controllers/raceController");
const authMiddleware = require("../middlewares/auth");
const raceRouter = express.Router();
raceRouter.use(express.json());

raceRouter
  .route("/api/v1/races", raceController.index)
  .get(raceController.getAllRaces)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), raceController.createRace)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), raceController.updateRace) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), raceController.deleteRaces); //Not supported

raceRouter
  .route("/api/v1/races/:raceId")
  .get(raceController.getRaceById)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), raceController.createRaceWithId) //Not supported
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), raceController.updateRaceById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), raceController.deleteRaceById);

module.exports = raceRouter;