"use strict"

const express = require("express");
const sportController = require("../controllers/sportController");
const sportRouter = express.Router();
sportRouter.use(express.json());

sportRouter
  .route("/api/v1/sports", sportController.index)
  .get(sportController.getAllSports)
  .post(sportController.createSport)
  .put(sportController.updateSport)
  .delete(sportController.deleteSports);

sportRouter
  .route("/api/v1/sports/:sportId")
  .get(sportController.getSportById)
  .post(sportController.createSportWithId)
  .put(sportController.updateSportById)
  .delete(sportController.deleteSportById);

module.exports = sportRouter;