"use strict"

const express = require("express");
const sportController = require("../controllers/sportController");
const sportRouter = express.Router();
const { isLoggedIn } = require("../middlewares/auth");
const { isAllowedToHandleSportsById, isAllowedToCreateSports } = require("../middlewares/accessControls/sportsResource")
sportRouter.use(express.json());

sportRouter
  .route("/api/v1/sports", sportController.index)
  .get(sportController.getAllSports)
  .post(isLoggedIn, isAllowedToCreateSports, sportController.createSport)
  .put(isLoggedIn, sportController.updateSport) //Not supported
  .delete(isLoggedIn, sportController.deleteSports);//Not supported

sportRouter
  .route("/api/v1/sports/:sportId")
  .get(sportController.getSportById)
  .post(isLoggedIn, sportController.createSportWithId) //Not supported
  .put(isLoggedIn, isAllowedToHandleSportsById("update"), sportController.updateSportById)
  .delete(isLoggedIn, isAllowedToHandleSportsById("delete"), sportController.deleteSportById);

module.exports = sportRouter;