"use strict"

const express = require("express");
const sportController = require("../controllers/sportController");
const sportRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
sportRouter.use(express.json());

sportRouter
  .route("/api/v1/sports", sportController.index)
  .get(sportController.getAllSports)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), sportController.createSport)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), sportController.updateSport) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), sportController.deleteSports);//Not supported

sportRouter
  .route("/api/v1/sports/:sportId")
  .get(sportController.getSportById)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), sportController.createSportWithId) //Not supported
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), sportController.updateSportById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), sportController.deleteSportById);

module.exports = sportRouter;